
const { decode } = require( 'html-entities' );
const { encode } = require('he');
const equal = require('fast-deep-equal');
const ss = require('string-similarity');

const { loadUNOData } = require('./data-layer/unoData');
const { loadCSVData } = require('./data-layer/csvData');
const { loadCSV2UNOData, saveCSV2UNOData } = require('./data-layer/csv2uno');

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

function getMapOfUniqTitles(data) {
    const map = new Map();

    for (const [_, value] of data) {
        const { title } = value;
        map.set(title, value);
    }

    if (map.size !== data.size) {
        console.log('TITLES not uniq');
        console.log('uniq titles size:', map.size);
        console.log('id map size:', data.size);
    }

    return map;
}

async function extraMatchTitles(csvIds) {
    const { csvTitles } = await loadCSVData();
    const { unoTitles } = await loadUNOData();

    const { csv2uno } = await loadCSV2UNOData();

    const unoUniqTitles = getMapOfUniqTitles(unoTitles);

    const notMatchedUno = [];
    const notMatchedCSV = [];

    const extraMatched = [];
    for (const id of csvIds) {

        const show_id = id;
        const { title } = csvTitles.get(id);

        const unoTitle = findTitleInUNO(title, [...unoUniqTitles.keys()]);
        const value = unoUniqTitles.get(unoTitle);

        if (!value) {
            continue;
        }

        extraMatched.push({ show_id, title });

        const obj = {
            id: value.id,
            title_csv: title,
            tille_uno: unoTitle,
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

    // console.log('CSV UNMATCHED TITLES');
    // console.log(notMatchedCSV.length, notMatchedCSV);

    console.log('EXTRA MATCHED');
    console.log(extraMatched);

    await saveCSV2UNOData({ csv2uno });

    // return { notMatchedUno, notMatchedCSV };

    return extraMatched;
}

// matchTitles();




module.exports = {
    extraMatchTitles,
};



function findTitleInUNO(title, unoTitles) {
    const _title = toUnoTitle(title);

    console.log();
    console.log('TRYING TO MATCH WITH STRING SIMILARITY');
    // console.log(_title);
    console.log(title);

    // const matches = ss.findBestMatch(_title, unoTitles);
    // const matches2 = ss.findBestMatch(title, unoTitles);
    // const matches3 = ss.findBestMatch(_title.toLowerCase(), unoTitles.map(t => t.toLowerCase()));
    const matches4 = ss.findBestMatch(title.toLowerCase(), unoTitles.map(t => t.toLowerCase()));
    console.log();

    let bestMatch = null;

    if (matches4.bestMatch.rating > 0.9) {
        bestMatch = matches4.bestMatch.target;
    }

    const unoTitle = bestMatch && unoTitles.find(title => title.toLowerCase() === bestMatch);

    if (unoTitle) {
        console.log('MATCHED UNO TITLE WITH EXTRA S');
        console.log(unoTitle);
        console.log();
    }

    //  matches.bestMatch.rating > 0.9 && console.log('1', matches.bestMatch);
    // matches2.bestMatch.rating > 0.9 && console.log('2', matches2.bestMatch);
    // matches3.bestMatch.rating > 0.9 && console.log('3', matches3.bestMatch);
    // matches4.bestMatch.rating > 0.9 && console.log('4', matches4.bestMatch);

    return unoTitle;
}

function toUnoTitle(title) {
    return encode(title.replace('&', 'and'), {  decimal: true });
}

function fromUnoTitle(title) {
    return decode(title).replace('and', '&');
}



