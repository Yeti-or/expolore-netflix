const path = require('path');

const fs = require('fs-extra');

const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('data');

/*
    [id: number]: [
        {
          "uhd": 0,
          "expiredate": "0000-00-00",
          "subtitle": "Danish,English,Japanese",
          "cc": "IS",
          "newdate": "2019-12-28",
          "audio": "Japanese - Audio Description,Japanese [Original]",
          "seasdet": "",
          "hd": 0,
          "3d": null
        },
        {
          "uhd": 0,
          "expiredate": "0000-00-00",
          "subtitle": "Arabic,English,French,Japanese,Polish",
          "cc": "GB",
          "newdate": "2019-12-28",
          "audio": "Japanese - Audio Description,Japanese [Original]",
          "seasdet": "",
          "hd": 0,
          "3d": null
        },
        {
          "uhd": 0,
          "expiredate": "0000-00-00",
          "subtitle": "Arabic,English,European Spanish,Japanese,Romanian",
          "cc": "ES",
          "newdate": "2019-12-28",
          "audio": "Japanese - Audio Description,Japanese [Original]",
          "seasdet": "",
          "hd": 0,
          "3d": null
        },
        {
          "uhd": 0,
          "expiredate": "0000-00-00",
          "subtitle": "English,Japanese",
          "cc": "ZA",
          "newdate": "2019-12-28",
          "audio": "Japanese - Audio Description,Japanese [Original]",
          "seasdet": "",
          "hd": 0,
          "3d": null
        },
        {
          "uhd": 0,
          "expiredate": "0000-00-00",
          "subtitle": "English,Spanish,French,Italian,Japanese",
          "cc": "CA",
          "newdate": "2019-12-28",
          "audio": "Japanese - Audio Description,Japanese [Original]",
          "seasdet": "",
          "hd": 0,
          "3d": null
        }
  ]
*/
const PATH_TO_UNO_COUNTRY_INFO = path.join(PATH_TO_DATA, 'unoDATA', 'unoCountryInfo.json');


async function loadUNOCountryInfo() {
    try {
        // make sure it exists
        await fs.ensureFile(PATH_TO_UNO_COUNTRY_INFO);
        const unoBuf = await fs.readFile(PATH_TO_UNO_COUNTRY_INFO);
        const unoStr = unoBuf.toString();

        if (!unoStr) {
            console.log('UNO_COUNTRY_INFO IS EMPTY', PATH_TO_UNO_COUNTRY_INFO);
            return { unoCountryInfo: new Map() };
        }

        const unoCountryInfo = JSONtoMap(unoStr);

        console.log();
        console.log('!!! LOADED UNO_COUNTRY_INFO', unoCountryInfo.size);
        console.log();

        return { unoCountryInfo };

    } catch (err) {
        console.log('ERROR WHILE LOADING FROM', PATH_TO_UNO_COUNTRY_INFO);
        return { unoCountryInfo: null };
    }
}

async function saveUNOCountryInfo({ unoCountryInfo }) {
    try {
        if (!unoCountryInfo.size) {
            console.log('UNO_COUNTRY_INFO IS EMPTY', 'NOTHING TO SAVE!');
            return;
        }
        const unoStr = mapToJSON(unoCountryInfo);

        try {
            await fs.writeFile(PATH_TO_UNO_COUNTRY_INFO, unoStr);
        } catch(err) {
            console.log('ERROR while writing to', PATH_TO_UNO_COUNTRY_INFO);
            throw err;
        }

        console.log();
        console.log('!!! SAVED UNO_COUNTRY_INFO', unoCountryInfo.size);
        console.log();
    } catch(err) {
        console.log('ERROR while saving UNO_COUNTRY_INFO!!!!');
        console.log(err);
        console.log();
    }
}


module.exports = {
    loadUNOCountryInfo,
    saveUNOCountryInfo,
};
