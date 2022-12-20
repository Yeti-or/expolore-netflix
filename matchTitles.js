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

  function filterCSVTitles(csvTitles, csv2uno){
      for (const key of csvTitles.keys()) {
          if (csv2uno.has(key)) {
              csvTitles.delete(key);
          }
      }

      return csvTitles;
  }


async function matchTitles() {
    const { csvTitles } = await loadCSVData();
    const { unoTitles } = await loadUNOData();

    const { csv2uno } = await loadCSV2UNOData();

    filterCSVTitles(csvTitles, csv2uno);


    const csvUniqTitles = getMapOfUniqTitles(csvTitles, 'csvTitles');
    const unoUniqTitles = getMapOfUniqTitles(unoTitles, 'unoTitles');

    console.log('csvUniqTitles', csvUniqTitles.size);
    console.log('unoUniqTitles', unoUniqTitles.size);


    const notMatchedUno = [];
    const notMatchedCSV = [];

    for (const [title, value] of unoUniqTitles) {
        const csvTitleObj = findTitleInCSV(title, csvUniqTitles);

        if (!csvTitleObj) {
            notMatchedUno.push(value.id);
            continue;
        }

        const obj = {
            id: value.id,
            title_csv: csvTitleObj.title,
            tille_uno: title,
        }

        const { show_id } = csvTitleObj;

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

    // for (const [title, value] of [...csvUniqTitles].slice(0, 20)) {
    for (const [title, value] of csvUniqTitles) {
        const unoTitleObj = findTitleInUNO(title, unoUniqTitles);

        if (!unoTitleObj) {
            notMatchedCSV.push(value.show_id);
        }
    }

    // TODO: save to data/
    console.log('UNO UNMATCHED TITLES');
    console.log(notMatchedUno.length, notMatchedUno);

    console.log('CSV UNMATCHED TITLES');
    console.log(notMatchedCSV.length, notMatchedCSV);

    await saveCSV2UNOData({ csv2uno });

    return { notMatchedUno, notMatchedCSV };
}

// matchTitles();




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


    return first || second;
}

function toUnoTitle(title) {
    return encode(title.replace('&', 'and'), {  decimal: true });
}

function fromUnoTitle(title) {
    return decode(title).replace('and', '&');
}



