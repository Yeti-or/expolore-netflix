const path = require('path');
const fs = require('fs-extra');

const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('data');

/*
    "tt9894394": {
    [ttID: string]: {
        "tconst": "tt9894394",
        "titleType": "movie",
        "primaryTitle": "Upin & Ipin: Keris Siamang Tunggal",
        "originalTitle": "Upin & Ipin: Keris siamang tunggal",
        "isAdult": "0",
        "startYear": "2019",
        "endYear": "\\N",
        "runtimeMinutes": "100",
        "genres": "Animation"
    }
*/
const PATH_TO_CSV_2_UNO = path.join(PATH_TO_DATA, 'imdb.json');


async function loadIMDBData() {
    try {
        // make sure it exists
        await fs.ensureFile(PATH_TO_CSV_2_UNO);
        const csv2UNOBuf = await fs.readFile(PATH_TO_CSV_2_UNO);
        const csv2UNOStr = csv2UNOBuf.toString();

        if (!csv2UNOStr) {
            console.log('IMDB IS EMPTY', PATH_TO_CSV_2_UNO);
            return { imdb: new Map() };
        }

        const imdb = JSONtoMap(csv2UNOStr, (a,b) => a - b);

        console.log();
        console.log('!!! LOADED IMDB', imdb.size);
        console.log();

        return { imdb };

    } catch (err) {
        console.log('ERROR WHILE LOADING FROM', PATH_TO_CSV_2_UNO);
        return { imdb: null };
    }
}

async function saveIMDBData({ imdb }) {
    try {
        if (!imdb.size) {
            console.log('IMDB IS EMPTY', 'NOTHING TO SAVE!');
            return;
        }
        const csv2UNOStr = mapToJSON(imdb, (a, b) => a - b);

        try {
            await fs.writeFile(PATH_TO_CSV_2_UNO, csv2UNOStr);
        } catch(err) {
            console.log('ERROR while writing to', PATH_TO_CSV_2_UNO);
            throw err;
        }

        console.log();
        console.log('!!! SAVED CSV_2_UNO', imdb.size);
        console.log();
    } catch(err) {
        console.log('ERROR while saving csvDATA!!!!');
        console.log(err);
        console.log();
    }
}


module.exports = {
    loadIMDBData,
    saveIMDBData,
};
