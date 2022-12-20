const path = require('path');
const fs = require('fs');

const { parse } = require('csv-parse');

const { saveIMDBData } = require('../data-layer/imdbData');

const { loadUNOData } = require('../data-layer/unoData');
const { loadCSVData } = require('../data-layer/csvData');

const PATH_TO_CSV = path.resolve('../data-examples/tiltes_imdb.tsv');


const matchedID = (ttID, by) => {
    const def = {
        ttID,
        by_primary: false,
        by_original: false,
        by_primaryLK: false,
        by_originalLK: false,
        by_primarySS: false,
        by_originalSS: false,
    };

    switch (by) {

        case 'primary':
            return {
                ...def,
                by_primary: true,
            };

        case 'original':
            return {
                ...def,
                by_original: true,
            };

        case 'primaryLK': 
            return {
                ...def,
                by_primaryLK: true,
            };

        case 'originaLK':
            return {
                ...def,
                by_originalLK: true,
            };

        case 'primarySS': 
            return {
                ...def,
                by_primarySS: true,
            };

        case 'originaSS':
            return {
                ...def,
                by_originalSS: true,
            };

    }

    throw new Error('switch goes brrr');
};

const setToMap = (map, show_id, ttID, by) => {
    return map.set(show_id, (map.get(show_id) || []).concat(matchedID(ttID, by)));
};

/*
    [show_id]: [{
        ttID: string;
        by_primary: bool;
        by_original: bool;
        by_primaryLK: bool;
        by_originalLK: bool;
        by_primarySS: bool;
        by_originalSS: bool;
    }]
*/


// match csv to imdb ids
const csvToImdbByPrimaryTitle = new Map();

const csvToImdnByOriginalTitle = new Map();

const csvToImdbByPrimaryTitleLK = new Map();

const csvToImdnByOriginalTitleLK = new Map();

const csvToImdbByPrimaryTitleSS = new Map();

const csvToImdnByOriginalTitleSS = new Map();


const records = [];
const extraRecords = [];

function checkColumns(records) {
    console.log(records[0]);

    const obj = recordToObj(records[0]);

    for (const key of Object.keys(obj)) {
        console.log('column', key, obj[key], obj[key] === key);
    }
}

function checkIds(records) {
    const last = records[records.length - 1];
    console.log(records.length - 1, records[1][0], last[0] || last);
}

function processCSV(records) {
    checkColumns(records);
    checkIds(records);

    const imdb = recordsToMap(records.slice(1));
    saveIMDBData({ imdb }).then(() => {
        console.log('CSV PARSED AND SAVED', imdb.size);
    }).catch(err => {
        console.log('ERROR WHILE SAVEING CSV data');
    });
}

const imdbToUno = new Map();
const titlesInCSV = new Map();

(async function() {
    const { unoTitles } = await loadUNOData();

    unoTitles.forEach(uno => {
        imdbToUno.set(uno.imdbid, uno);
    });

    const { csvTitles } = await loadCSVData();

    csvTitles.forEach(csv => {
        titlesInCSV.set(csv.title, csv);
    });

    console.log('titlesInCSV', titlesInCSV.size);
}());



const parser = parse({
  delimiter: '\t',
  escape: ' ',
  quote: false,
});

let i = 0;
let j = 0;
let k = 0;

parser.on('readable', function() {
  let record;
  while ((record = parser.read()) !== null) {
      // first row
      if (!records.length) {
          records.push(record);
      }

      const [ttID, _, primaryTitle, originalTitle] = record;

      // save titles that matched uno
      if (imdbToUno.has(ttID)) {
          console.log('MATCHED imdb in UNO', ++i);
          records.push(record);
      }

      // const setToMap = (map, show_id, ttID, by) => {
      if (titlesInCSV.has(primaryTitle)) {
          const { show_id } = titlesInCSV.get(primaryTitle);

          setToMap(csvToImdbByPrimaryTitle, show_id, ttID, 'primary');

          extraRecords.push(record);
      } else if (titlesInCSV.has(originalTitle)) {
          const { show_id } = titlesInCSV.get(originalTitle);

          setToMap(csvToImdnByOriginalTitle, show_id, ttID, 'original');

          extraRecords.push(record);
      }

      if (imdbToUno.has(record[0]) && titlesInCSV.has(record[2])) {
          k++;
      }
  }
});
parser.on('error', function(err) {
  console.log('ERORR WHILE PARSING TSV');
  console.log(err.message);
});
parser.on('end', function(){
    console.log(records.length);
    console.log('uno', i);
    console.log('csv', j);
    console.log('both', k);
    console.log();
    console.log();
    console.log('csvToImdbByPrimaryTitle', csvToImdbByPrimaryTitle.size);
    console.log('csvToImdnByOriginalTitle', csvToImdnByOriginalTitle.size);
    console.log('extraRecords', extraRecords.length);
    console.log();
    console.log();

    processCSV(records);
});

fs.createReadStream(PATH_TO_CSV).pipe(parser);


function recordToObj(record) {
    const [tconst, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtimeMinutes, genres] = record;

    const obj = {
        tconst,
        titleType,
        primaryTitle,
        originalTitle,
        isAdult,
        startYear,
        endYear,
        runtimeMinutes,
        genres,
    };

    // 'show_id' !== 'show_id' O_O
    for (const key of Object.keys(obj)) {
        obj[key] = obj[key].trim();
    }

    return obj;
}

function recordsToMap(records) {
    const map = new Map();
    for (const record of records) {
        const obj = recordToObj(record);
        const { tconst, primaryTitle } = obj;
        if (!primaryTitle) {
            console.log();
            console.log();
            console.log('WHAT THE FUCK !!!', obj);
            console.log();
        }

        map.set(tconst, obj);
    }

    return map;
}
