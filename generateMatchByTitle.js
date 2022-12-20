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
            'type','title','director','cast','country','date_added','release_year','rating','duration','listed_in','description',
            'imdb_rating', 'tconst',
            'uniqCountries', 'uniqAudio'
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

        const record = toArr(csv);

        // imdb_rating
        record.push(imdbrating, imdbid);

        const countriesInfo = unoCountryInfo.get(show_id);
        if (!countriesInfo) {
            console.log(show_id, csv, countriesInfo);
            console.log(csv2uno.get(show_id));
            console.log(unoTitles.get(csv2uno.get(show_id).id));
            throw 'WTF!!';
        }
        const { uniqCountries, uniqAudio } = getUniqInfo(countriesInfo);

        if (!uniqCountries.size || !uniqAudio.size) {
            console.log('IGNORE ', csv.title, 'countries', uniqCountries.size, 'audio', uniqAudio.size);
            continue;
        }

        // uniqCountries, uniqAudio
        record.push(uniqCountries.size, uniqAudio.size);

        res.push(record);
    }

    console.log(res.length - 1);

    // stringify(res.slice(0, 10)).pipe(process.stdout);;
    stringify(res).pipe(fs.createWriteStream('./netflix_titles_with_info.csv'));
}

function getUniqInfo(countriesInfo) {
    const uniqCountries = new Set();
    const uniqAudio = new Set();


    for (const info of countriesInfo) {
        // if (info.country === 'Russia') {
        //     continue;
        // }

        if (info.country) {
            uniqCountries.add(info.country.trim().toLowerCase());
        } else {
            console.log('NO country INFO', info);
        }

        // sample:
        // "audio": "German,English,Spanish - Audio Description,Spanish [Original],French,Italian,Brazilian Portuguese",
        info.audio.split(',').forEach(audio => {
            const clean = audio.replace(' - Audio Description', '').replace(' [Original]', '').trim().toLowerCase();

            // if (clean === 'russian') {
            //     return;
            // }

            uniqAudio.add(clean);
        });

    }

    return { uniqCountries, uniqAudio };
}


function toArr(csv) {
    const {
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
    } = csv;

    return [show_id,type,title,director,cast,country,date_added,release_year,rating,duration,listed_in,description];
}


main();
