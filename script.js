const outputFolder = "lyrics-analysis/outputs";
const csvFiles = [
    "output_cbow_s050.csv",
    "output_cbow_s100.csv",
    "output_cbow_s300.csv",
    "output_glove_s050.csv",
    "output_glove_s100.csv",
    "output_glove_s300.csv",
    "output_skip_s050.csv",
    "output_skip_s100.csv",
    "output_skip_s300.csv"
];

const songSelector = document.getElementById("songSelector");
const resultsTable = document.getElementById("resultsTable");

const modelData = {}; // model -> [ { song1, song2, similarity } ]
const allSongs = new Set();
const modelNames = [];

function parseCSV(content) {
    const lines = content.trim().split("\n").slice(1);
    return lines.map(line => {
        const [song1, song2, similarity] = line.split(";");
        return { song1, song2, similarity: parseFloat(similarity) };
    });
}

function loadCSV(file) {
    return fetch(`${outputFolder}/${file}`)
        .then(res => res.text())
        .then(content => {
            const modelName = file.replace("output_", "").replace(".csv", "");
            modelNames.push(modelName);
            const records = parseCSV(content);
            modelData[modelName] = records;

            records.forEach(({ song1, song2 }) => {
                allSongs.add(song1);
                allSongs.add(song2);
            });
        });
}

function populateSelector() {
    Array.from(allSongs).sort().forEach(song => {
        const option = document.createElement("option");
        option.value = song;
        option.textContent = song;
        songSelector.appendChild(option);
    });
}

function updateTable(selectedSong) {
    const tableHead = resultsTable.querySelector("thead tr");
    const tableBody = resultsTable.querySelector("tbody");

    // Clear existing table
    tableHead.innerHTML = "<th>Música</th>";
    modelNames.sort();
    modelNames.forEach(model => {
        const th = document.createElement("th");
        th.textContent = model;
        tableHead.appendChild(th);
    });

    // Add Average and Std Dev headers
    const avgTh = document.createElement("th");
    avgTh.textContent = "Média";
    tableHead.appendChild(avgTh);

    const stdTh = document.createElement("th");
    stdTh.textContent = "Desvio Padrão";
    tableHead.appendChild(stdTh);

    // Create map: song -> { model1: similarity, model2: similarity, ... }
    const songScores = {};

    modelNames.forEach(model => {
        modelData[model].forEach(({ song1, song2, similarity }) => {
            let otherSong = null;
            if (song1 === selectedSong) otherSong = song2;
            else if (song2 === selectedSong) otherSong = song1;

            if (otherSong) {
                if (!songScores[otherSong]) songScores[otherSong] = {};
                songScores[otherSong][model] = parseFloat(similarity);
            }
        });
    });

    // Build rows
    tableBody.innerHTML = "";
    Object.entries(songScores)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([otherSong, similarities]) => {
            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = otherSong;
            tr.appendChild(tdName);

            const values = [];

            modelNames.forEach(model => {
                const td = document.createElement("td");
                const value = similarities[model];

                if (value !== undefined) {
                    values.push(value);
                    const fixedValue = value.toFixed(4);
                    td.textContent = fixedValue;

                    const level = Math.min(9, Math.floor(value * 10)); // 0 to 9
                    if (level < 0) {
                        td.classList.add(`score-n`);
                    } else {
                        td.classList.add(`score-${level}`);
                    }
                } else {
                    td.textContent = "-";
                }

                tr.appendChild(td);
            });

            // Média e desvio padrão
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const std = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length);

            const tdAvg = document.createElement("td");
            tdAvg.textContent = isNaN(avg) ? "-" : avg.toFixed(4);
            tdAvg.classList.add("summary");
            const level = Math.min(9, Math.floor(avg * 10)); // 0 to 9
            if (level < 0) {
                tdAvg.classList.add("score-n");
            } else {
                tdAvg.classList.add(`score-${level}`);
            }

            const tdStd = document.createElement("td");
            tdStd.textContent = isNaN(std) ? "-" : std.toFixed(4);
            tdStd.classList.add("summary");

            tr.appendChild(tdAvg);
            tr.appendChild(tdStd);

            tableBody.appendChild(tr);
        });
}


function sanitizeFilename(songName) {
    // Remove special characters and spaces, replace by underscores or similar
    return songName
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumeric
        .replace(/\s+/g, '') + '.json';
}

function loadSongMetadata(songName) {
    const filename = sanitizeFilename(songName);
    const metadataDiv = document.getElementById("songMetadata");

    fetch(`lyrics-analysis/songs/${filename}`)
        .then(res => {
            if (!res.ok) throw new Error("Metadata not found");
            return res.json();
        })
        .then(data => {
            metadataDiv.innerHTML = `
          <h3>"${data.name}"</h3>
          <p><strong>Autores:</strong> ${data.lyricists.join(", ")}</p>
          <p><strong>Melodia:</strong> ${data.melody_authors.join(", ")}</p>
          <p><strong>Tom:</strong> ${data.tone}</p>
          <p><strong>BPM:</strong> ${data.beats_per_minute}</p>
        `;
        })
        .catch(err => {
            metadataDiv.innerHTML = `<p><em>Dados não disponíveis para "${songName}"</em></p>`;
        });
}

songSelector.addEventListener("change", e => {
    const selectedSong = e.target.value;
    if (selectedSong) updateTable(selectedSong);
});

songSelector.addEventListener("change", () => {
    const selected = songSelector.value;
    updateTable(selected);
    loadSongMetadata(selected);
});

Promise.all(csvFiles.map(loadCSV)).then(() => {
    populateSelector();
});
