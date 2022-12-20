const path = require('path');

const fs = require('fs-extra');

const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('data');

/*
    [id: string]: {
      show_id: 's1',
      type: 'Movie',
      title: 'Dick Johnson Is Dead',
      director: 'Kirsten Johnson',
      cast: '',
      country: 'United States',
      date_added: 'September 25, 2021',
      release_year: '2020',
      rating: 'PG-13',
      duration: '90 min',
      listed_in: 'Documentaries',
      description: 'As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.'
    }
*/
const PATH_TO_CSV_TITLES = path.join(PATH_TO_DATA, 'csvDATA', 'csvTitles.json');


async function saveCSVTitles({ csvTitles }) {
    if (!csvTitles.size) {
        console.log('CSV TITLES IS EMPTY', 'NOTHING TO SAVE!');
        return;
    }
    const csvTitlesStr = mapToJSON(csvTitles, (a, b) => a - b);

    try {
        await fs.writeFile(PATH_TO_CSV_TITLES, csvTitlesStr);
    } catch(err) {
        console.log('ERROR while writing to', PATH_TO_CSV_TITLES);
        throw err;
    }
}

async function loadCSVTitles() {
    try {
        // make sure it exists
        await fs.ensureFile(PATH_TO_CSV_TITLES);
        const csvTitlesBuf = await fs.readFile(PATH_TO_CSV_TITLES);
        const csvTitlesStr = csvTitlesBuf.toString();
        if (!csvTitlesStr) {
            console.log('CSV_TITLES IS EMPTY', PATH_TO_CSV_TITLES);
            return new Map();
        }
        return JSONtoMap(csvTitlesStr, (a,b) => a - b);
    } catch (err) {
        console.log('ERROR WHILE LOADING FROM', PATH_TO_CSV_TITLES);
        return null;
    }
}


async function loadCSVData() {
    const csvTitles = await loadCSVTitles();

    console.log();
    console.log('!!! LOADED CSV_TITLES', csvTitles && csvTitles.size);
    console.log();

    return { csvTitles };
}

async function saveCSVData({ csvTitles }) {
    try {
        await saveCSVTitles({ csvTitles });
        console.log();
        console.log('!!! SAVED CSV_TITLES', csvTitles.size);
        console.log();
    } catch(err) {
        console.log('ERROR while saving csvDATA!!!!');
        console.log(err);
        console.log();
    }
}


module.exports = {
    loadCSVData,
    saveCSVData,
};
