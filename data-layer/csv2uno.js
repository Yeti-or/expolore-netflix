const path = require('path');
const fs = require('fs-extra');

const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('data');

/*
    [show_id: string]: {
      id: number,
      title_csv: string;
      title_uno: string;
    }
*/
const PATH_TO_CSV_2_UNO = path.join(PATH_TO_DATA, 'csvToUNO.json');


async function loadCSV2UNOData() {
    try {
        // make sure it exists
        await fs.ensureFile(PATH_TO_CSV_2_UNO);
        const csv2UNOBuf = await fs.readFile(PATH_TO_CSV_2_UNO);
        const csv2UNOStr = csv2UNOBuf.toString();

        if (!csv2UNOStr) {
            console.log('CSV_2_UNO IS EMPTY', PATH_TO_CSV_2_UNO);
            return { csv2uno: new Map() };
        }

        const csv2uno = JSONtoMap(csv2UNOStr, (a,b) => a - b);

        console.log();
        console.log('!!! LOADED CSV_2_UNO', csv2uno.size);
        console.log();

        return { csv2uno };

    } catch (err) {
        console.log('ERROR WHILE LOADING FROM', PATH_TO_CSV_2_UNO);
        return { csv2uno: null };
    }
}

async function saveCSV2UNOData({ csv2uno }) {
    try {
        if (!csv2uno.size) {
            console.log('CSV 2 UNO IS EMPTY', 'NOTHING TO SAVE!');
            return;
        }
        const csv2UNOStr = mapToJSON(csv2uno, (a, b) => a - b);

        try {
            await fs.writeFile(PATH_TO_CSV_2_UNO, csv2UNOStr);
        } catch(err) {
            console.log('ERROR while writing to', PATH_TO_CSV_2_UNO);
            throw err;
        }

        console.log();
        console.log('!!! SAVED CSV_2_UNO', csv2uno.size);
        console.log();
    } catch(err) {
        console.log('ERROR while saving csvDATA!!!!');
        console.log(err);
        console.log();
    }
}


module.exports = {
    loadCSV2UNOData,
    saveCSV2UNOData,
};
