

const { loadUNOData } = require('./data-layer/unoData');
const { loadIMDBData } = require('./data-layer/imdbData');
const { loadCSVData } = require('./data-layer/csvData');
const { loadCSV2UNOData } = require('./data-layer/csv2uno');

async function main() {
    const imdbToUno = new Map();

    const { unoTitles } = await loadUNOData();
    const { imdb } = await loadIMDBData();
    const { csvTitles } = await loadCSVData();

    const { csv2uno } = await loadCSV2UNOData();


    function searchIMDB(title) {
        for (const [_, m] of imdb) {
            if (m.primaryTitle === title) {
                return m;
            }
            if (m.originalTitle === title) {
                return m;
            }
        }

        return null;
    }

    unoTitles.forEach(uno => {
        imdbToUno.set(uno.imdbid, uno);
    });

    const csvToUnoByIMDB = new Map();

    csvTitles.forEach(csvTitle => {
        const found = searchIMDB(csvTitle.title);
        if (found) {
            csvToUnoByIMDB.set(csvTitle.show_id, found);
        }
    });

    console.log(csvToUnoByIMDB.size);

    const newMatches = [...csvToUnoByIMDB.keys()].filter(show_id => !csv2uno.has(show_id));

    console.log(newMatches.length);

}

main();
