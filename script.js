const outputFolder = "lyrics-analysis/outputs";
const csvFiles = [
    "output_cbow_s50.csv",
    "output_cbow_s100.csv",
    "output_cbow_s300.csv",
    "output_glove_s50.csv",
    "output_glove_s100.csv",
    "output_glove_s300.csv",
    "output_skip_s50.csv",
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
    modelNames.forEach(model => {
        const th = document.createElement("th");
        th.textContent = model;
        tableHead.appendChild(th);
    });

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

            modelNames.forEach(model => {
                const td = document.createElement("td");
                const value = similarities[model];

                if (value !== undefined) {
                    const fixedValue = value.toFixed(4);
                    td.textContent = fixedValue;

                    const level = Math.min(9, Math.floor(value * 10)); // 0 to 9
                    td.classList.add(`score-${level}`);
                } else {
                    td.textContent = "-";
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });
}


songSelector.addEventListener("change", e => {
    const selectedSong = e.target.value;
    if (selectedSong) updateTable(selectedSong);
});

Promise.all(csvFiles.map(loadCSV)).then(() => {
    populateSelector();
});
