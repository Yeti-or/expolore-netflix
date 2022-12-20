

// Match only by title & lowerCaseTitle inside uno

const { decode } = require( 'html-entities' );
const { encode } = require('he');
const equal = require('fast-deep-equal');
const ss = require('string-similarity');

const { loadUNOData } = require('./data-layer/unoData');
const { loadCSVData } = require('./data-layer/csvData');
const { loadCSV2UNOData, saveCSV2UNOData } = require('./data-layer/csv2uno-by-title');

  // // unoMap {
  //     [id ]: { id: num, nfid: num, imdb_id: 'tt', ...data } => more_data
  // }
  // 
  // // csvMap {
  //     [sid]: { show_id: sid, ...data }
  // }

  // // csvToUno {
  //     [show_id]: { id, title_csv, title_uno } 
  // }

async function matchTitles() {
    const { csvTitles } = await loadCSVData();
    const { unoTitles } = await loadUNOData();

    const { csv2uno } = await loadCSV2UNOData();

    const csvUniqTitles = getMapOfUniqTitles(csvTitles, 'csvTitles');
    const unoUniqTitles = getMapOfUniqTitles(unoTitles, 'unoTitles');

    console.log('csvUniqTitles', csvUniqTitles.size);
    console.log('unoUniqTitles', unoUniqTitles.size);


    const notMatchedCSV = [];

    for (const [title, csv] of csvUniqTitles) {
        const { show_id } = csv;

        const uno = findTitleInUNO(title, unoUniqTitles);

        if (!uno) {
            notMatchedCSV.push(csv.show_id);
            continue;
        }

        const obj = {
            id: uno.id,
            title_csv: title,
            tille_uno: uno.title,
        }

        if (csv2uno.has(show_id)) {
            if (!equal(csv2uno.get(show_id), obj)) {
                console.log('REWRITING csv2uno object');
                console.log();
                console.log('was', csv2uno.get(show_id));
                console.log('will be', obj);
                console.log();

                csv2uno.set(show_id, obj);
            }
        } else {
            csv2uno.set(show_id, obj);
        }
    }

    // TODO: save to data/
    // console.log('UNO UNMATCHED TITLES');
    // console.log(notMatchedUno.length, notMatchedUno);

    console.log('CSV UNMATCHED TITLES');
    console.log(notMatchedCSV.length, notMatchedCSV);

    console.log('CSV MATCHED', csv2uno.size);

    await saveCSV2UNOData({ csv2uno });

    return { notMatchedCSV };
    // return { notMatchedUno, notMatchedCSV };
}

matchTitles();




module.exports = {
    matchTitles,
};



function getMapOfUniqTitles(data, name) {
    const map = new Map();

    for (const [_, value] of data) {
        const { title } = value;
        map.set(title, value);
    }

    if (map.size !== data.size) {
        console.log('TODO');
        console.log('TITLES not uniq', name);
        console.log('uniq titles size:', map.size);
        console.log('id map size:', data.size);
    }

    return map;
}


function findTitleInCSV(title, csvTitles) {
    const _title = fromUnoTitle(title);

    if (title === _title) {
        return csvTitles.get(title);
    }

    const first = csvTitles.get(_title);
    const second = csvTitles.get(title);
    if (first && second) {
        console.log('WTF???', first, second);
    }
    return first || second;
}

function findTitleInUNO(title, unoTitles) {
    const _title = toUnoTitle(title);

    if (title === _title) {
        return unoTitles.get(title);
    }

    const first = unoTitles.get(_title);
    const second = unoTitles.get(title);
    if (first && second) {
        console.log('WTF???', first, second);
    }

    // moved to extraMatch
    // if (!first && !second) {
    //     const matches = ss.findBestMatch(_title, [...unoTitles.keys()]);

    //     console.log();
    //     console.log('TRYING TO MATCH WITH STRING SIMILARITY');
    //     console.log(_title);
    //     console.log(matches.bestMatch);
    //     console.log();
    //     console.log();
    // }


    return second || first;
}

function toUnoTitle(title) {
    return encode(title.replace('&', 'and'), {  decimal: true });
}

function fromUnoTitle(title) {
    return decode(title).replace('and', '&');
}



