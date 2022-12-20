const fs = require('fs');

const { stringify } = require('csv-stringify');

const { loadUNOData } = require('./data-layer/unoData');
const { loadCSVData } = require('./data-layer/csvData');
const { loadCSV2UNOData } = require('./data-layer/csv2uno-by-title');


const { loadUNOCountryInfo } = require('./data-layer/unoCountryInfo');


async function main() {
    const { csvTitles } = await loadCSVData();
    const { unoTitles } = await loadUNOData();

    const { csv2uno } = await loadCSV2UNOData();

    const { unoCountryInfo } = await loadUNOCountryInfo();

    const res = [
        [
            'show_id',
            'title',
            'tconst',
            'country',
            'audio'
        ]
    ];

    for (const [show_id, csv] of csvTitles) {
        if (!csv2uno.has(show_id)) {
            continue;
        }

        const { id } = csv2uno.get(show_id);
        const { imdbrating, imdbid } = unoTitles.get(id);

        if (!imdbrating) {
            // console.log('no rating', imdbrating);
            continue;
        }

        const record = [];

        record.push(show_id, csv.title);

        // imdb_rating
        record.push(imdbid);

        const countriesInfo = unoCountryInfo.get(show_id);
        if (!countriesInfo) {
            console.log(show_id, csv, countriesInfo);
            console.log(csv2uno.get(show_id));
            console.log(unoTitles.get(csv2uno.get(show_id).id));
            throw 'WTF!!';
        }
        const { uniqCountries } = getUniqInfo(countriesInfo);

        if (!uniqCountries.size ) {
            console.log('IGNORE ', csv.title, 'countries', uniqCountries.size);
            continue;
        }

        for (const [country, audios] of uniqCountries) {
            for (const audio of audios) {

                // record.push(uniqCountries.size, uniqAudio.size);
                res.push([...record, country, audio ]);
            }
        }


    }

    console.log(res.length - 1);

    // stringify(res.slice(0, 10)).pipe(process.stdout);;
    stringify(res).pipe(fs.createWriteStream('./netflix_titles_with_country_audio.csv'));
}

function getUniqInfo(countriesInfo) {
    const uniqCountries = new Map();


    for (const info of countriesInfo) {
        // if (info.country === 'Russia') {
        //     continue;
        // }

        if (!info.country) {
            console.log('NO country INFO', info);
            continue;
        }

        const uniqAudio = new Set();

        // sample:
        // "audio": "German,English,Spanish - Audio Description,Spanish [Original],French,Italian,Brazilian Portuguese",
        info.audio.split(',').forEach(audio => {
            const clean = audio.replace(' - Audio Description', '').replace(' [Original]', '').trim().toLowerCase();

            // if (clean === 'russian') {
            //     return;
            // }

            uniqAudio.add(clean);
        });

        uniqCountries.set(info.country.trim().toLowerCase(), [...uniqAudio]);

    }

    return { uniqCountries };
}


function toArr(csv) {
    const {
        show_id,
        title,
    } = csv;

    return [show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description];
}


main();
