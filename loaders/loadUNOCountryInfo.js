const equal = require('fast-deep-equal');

const { getCountyInfo } = require('../unoAPI');

const { loadCSVData } = require('../data-layer/csvData');
const { loadCSV2UNOData } = require('../data-layer/csv2uno-by-title');
const { loadUNOData } = require('../data-layer/unoData');

const { loadUNOCountryInfo, saveUNOCountryInfo } = require('../data-layer/unoCountryInfo');



async function loadCountryInfo(chunk_size=10, chunk=1) {
    const { unoTitles } = await loadUNOData();
    const { csvTitles } = await loadCSVData();
    const { csv2uno } = await loadCSV2UNOData();

    const { unoCountryInfo } = await loadUNOCountryInfo();

    const ids = [...csvTitles.keys()];



    console.log('csvTitles', csvTitles.size);
    console.log('matched titles', csv2uno.size);

    const matched = [...csvTitles].filter(([id]) => csv2uno.has(id));
    console.log(matched.length);

    await new Promise(res => setTimeout(res, 3000));

    for (const [show_id] of matched) {
        console.log('Processing show_id: ', show_id);


        const matchedOne = csv2uno.get(show_id);

        // console.log(matchedOne);

        const unoOne = unoTitles.get(matchedOne.id);

        console.log(unoOne.id);

        const netflixid = unoOne.nfid;

        if (!netflixid) {
            console.log(unoOne);
            throw new Error('NO NETFLIX ID ' + unoOne.id);
        }

        try {
            const res = await getCountyInfo(netflixid);

            const { results = [] } = res || {};

            if (!results.length) {
                console.log('RESULTS ARE EMPTY FOR', show_id, unoOne.title, netflixid);
            }

            if (unoCountryInfo.has(show_id)) {
                if (!equal(results, unoCountryInfo.get(show_id))) {
                    console.log('UPDATING unoTitles, id: ', show_id);
                    console.log(results);
                    console.log(unoTitles.get(show_id));

                    unoCountryInfo.set(show_id, results);
                }
            } else {
                unoCountryInfo.set(show_id, results);
            }
        } catch(err) {
            console.log(('ERROR While Loading county info for', show_id, unoOne.title, netflixid));
            throw err;
        }
    }

    await saveUNOCountryInfo({ unoCountryInfo });


    return;



    // console.log('Processing chunk', chunk);
    // const idsToProcess = ids.slice(chunk_size * (chunk - 1), chunk_size * chunk);

    // console.log('csv ids to process', idsToProcess[0], '=>', idsToProcess[idsToProcess.length - 1], 'len:', idsToProcess.length);
    // console.log();

    // // filter out already matched titles, cause we have already get uno titles for them in previous requests
    // const idsWithoutMatch = idsToProcess.filter(id => !csv2uno.has(id));
    // const matchedIds = idsToProcess.filter(id => csv2uno.has(id));

    // const recordsToProcess = idsWithoutMatch.map(id => csvTitles.get(id));

    // if (!recordsToProcess.length) {
    //     console.log('NOTHING TO PROCESS IN THIS CHUNK');
    //     return;
    // }

    // for (const obj of recordsToProcess) {
    //     if (!obj.title) {
    //         console.log('FAILED AT', chunk_size, chunk);
    //         console.log('No title for obj', JSON.stingify(obj));
    //         continue;
    //     }

    //     try {
    //         console.log();
    //         console.log('process: ', obj.show_id);
    //         const res = await searchTitle(obj.title);

    //         const { results } = res || {};
    //         if (!results || !results.length) {
    //             console.log('RESULTS ARE EMPTY FOR', obj.title);
    //             continue;
    //         }

    //         for (const re of results) {
    //             const { id, title } = re;


    //             if (unoTitles.has(id)) {
    //                 if (!equal(re, unoTitles.get(id))) {
    //                     console.log('UPDATING unoTitles, id: ', id);
    //                     console.log(re);
    //                     console.log(unoTitles.get(id));

    //                     unoTitles.set(id, re);
    //                 }
    //             } else {
    //                 unoTitles.set(id, re);
    //             }
    //         }


    //     } catch (err) {
    //         console.log('ERROR WHILE LOADING UNO DATA');
    //         console.log();
    //         console.log(err);
    //     }
    // }

    // await saveUNOData({ unoTitles });

    // console.log();
    // console.log('Processed chunk', chunk);
    // console.log('csv ids processed', recordsToProcess[0].show_id, '=>', recordsToProcess[recordsToProcess.length - 1].show_id, 'len:', recordsToProcess.length);
    // console.log();

    // console.log('skipped', matchedIds);
    // console.log('processed', idsWithoutMatch);
    // console.log('last processed chunk', recordsToProcess[recordsToProcess.length - 1].show_id);

    // return recordsToProcess.length;
}

loadCountryInfo();

module.exports = {
    loadCountryInfo,
};


// main().then((len) => {
//     len && console.log('SUCCESSFULLY loaded some more titles!', len);
// })
// .catch(err => {
//     console.log('ERROR but why?? ');
//     console.log();
//     console.log(err);
// });
