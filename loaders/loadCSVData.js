const path = require('path');
const fs = require('fs');

const { parse } = require('csv-parse');

const { saveCSVData } = require('../data-layer/csvData');

// uncomment and get 2 errors id csv data
// const PATH_TO_CSV = path.resolve('../data-examples/netflix_titles.csv');
const PATH_TO_CSV = path.resolve('../data-examples/netflix_titles_clean.csv');

const records = [];

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

    const csvTitles = recordsToMap(records.slice(1));
    saveCSVData({ csvTitles }).then(() => {
        console.log('CSV PARSED AND SAVED', csvTitles.size);
    }).catch(err => {
        console.log('ERROR WHILE SAVEING CSV data');
    });;
}



const parser = parse({
  delimiter: ';'
});

parser.on('readable', function() {
  let record;
  while ((record = parser.read()) !== null) {
    records.push(record);
  }
});
parser.on('error', function(err) {
  console.log('ERORR WHILE PARSING CSV');
  console.log(err.message);
});
parser.on('end', function(){
    console.log(records.length);
    processCSV(records);
});

fs.createReadStream(PATH_TO_CSV).pipe(parser);


function recordToObj(record) {
    const [show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description] = record;

    const obj = {
        show_id,
        type, 
        title,
        director,
        cast,
        country,
        date_added,
        release_year,
        rating,
        duration,
        listed_in,
        description,
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
        const { show_id, title } = obj;
        if (!title) {
            console.log();
            console.log();
            console.log('WHAT THE FUCK !!!', obj);
            console.log();
        }

        map.set(show_id, obj);
    }

    return map;
}
