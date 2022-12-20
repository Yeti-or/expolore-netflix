const path = require('path');

const fs = require('fs-extra');

const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('data');

/*
    [id: number]: {
      id: 26759,
      title: 'Over Her Dead Body',
      img: 'http://art-2.nflximg.net/d3d95/35cddabab7c56e8f04c4b63ee39fc2e6f35d3d95.jpg',
      vtype: 'movie',
      nfid: 70084781,
      synopsis: 'Killed by an ice sculpture at her wedding, Kate grows jealous when her fiancé gets cozy with the psychic he&#39;s hired to contact her beyond the grave.',
      avgrating: 3.2451065,
      year: 2008,
      runtime: 5662,
      imdbid: 'tt0785007',
      poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3NTgyNjg3NV5BMl5BanBnXkFtZTcwMzg2MzU1MQ@@._V1_SX300.jpg',
      imdbrating: 5.2,
      top250: number | null => 0,
      top250tv: number | null => 0,
      clist: '"GB":"United Kingdom"',
      titledate: '2015-04-14'
    }
*/
const PATH_TO_UNO_TITLES = path.join(PATH_TO_DATA, 'unoDATA', 'unoTitles.json');


async function saveUNOTitles({ unoTitles }) {
    if (!unoTitles.size) {
        console.log('UNO TITLES IS EMPTY', 'NOTHING TO SAVE!');
        return;
    }
    const unoTitlesStr = mapToJSON(unoTitles, (a, b) => a - b);

    try {
        await fs.writeFile(PATH_TO_UNO_TITLES, unoTitlesStr);
    } catch(err) {
        console.log('ERROR while writing to', PATH_TO_UNO_TITLES);
    }
}

async function loadUNOTitles() {
    try {
        // make sure it exists
        await fs.ensureFile(PATH_TO_UNO_TITLES);
        const unoTitlesBuf = await fs.readFile(PATH_TO_UNO_TITLES);
        const unoTitlesStr = unoTitlesBuf.toString();
        if (!unoTitlesStr) {
            console.log('UNO_TITLES IS EMPTY', PATH_TO_UNO_TITLES);
            return new Map();
        }
        return JSONtoMap(unoTitlesStr, (a,b) => a - b);
    } catch (err) {
        console.log('ERROR WHILE LOADING FROM', PATH_TO_UNO_TITLES);
        return null;
    }
}


async function loadUNOData() {
    const unoTitles = await loadUNOTitles();

    console.log();
    console.log('!!! LOADED UNO_TITLES', unoTitles.size);
    console.log();

    return { unoTitles };
}

async function saveUNOData({ unoTitles }) {
    try {
        debugger;
        await saveUNOTitles({ unoTitles });
        console.log();
        console.log('!!! SAVED UNO_TITLES', unoTitles.size);
        console.log();
    } catch(err) {
        console.log('ERROR while saving unoDATA!!!!');
        console.log(err);
        console.log();
    }
}


module.exports = {
    loadUNOData,
    saveUNOData,
};
