
const { loadCSVData } = require('./data-layer/csvData');
const { loadUNOData } = require('./data-layer/unoData');
const { loadCSV2UNOData } = require('./data-layer/csv2uno');

async function main() {
    const { csvTitles } = await loadCSVData();
    const { unoTitles } = await loadUNOData();

    const { csv2uno } = await loadCSV2UNOData();

    console.log('csvTitles', csvTitles.size);
    console.log('matched titles', csv2uno.size);

    const unMatched = [...csvTitles].filter(([id]) => !csv2uno.has(id));
    console.log(unMatched.length);

    const START = 10;
    const END = 100;

    for (let i = START; i < END; i++) {
        const [showId, obj] = unMatched[i];

        console.log(obj.title);
    }

    // logYearsFreq(csvTitles, 'release_year');
    logYearsFreq(unoTitles, 'year');

}

function logYearsFreq(titles, year_key) {
    const years = new Set([...titles].map(([_, a]) => a[year_key]));

    const yearsFreq = new Map();

    titles.forEach(a => {
        yearsFreq.set(a[year_key], (yearsFreq.get(a[year_key]) || 0) + 1);
    });

    console.log();
    console.log([...years].sort((a, b) => a - b));
    console.log();
    console.log('min', Math.min(...years));
    console.log('max', Math.max(...years));

    console.log();
    // console.log(yearsFreq);
    const _years = [...yearsFreq.keys()].sort((a, b) => a - b);

    for (const year of _years) {
        console.log(year, yearsFreq.get(year));
    }

    titles.forEach(a => {
        if (a[year_key] > 2030) {
            console.log(a);
        }
    });
}

main();
