

const { matchTitles } = require('./matchTitles');
const { extraMatchTitles } = require('./extraMatchTitles');
const { loadCSVData } = require('./data-layer/csvData');

const STOP = 4000;

async function main() {
    const { notMatchedCSV } = await matchTitles();
    const { csvTitles } = await loadCSVData();


    const notMatchedTitles = notMatchedCSV.map(id => {
        const { title, show_id } = csvTitles.get(id);

        return { title, show_id };
    });

    console.log(notMatchedTitles.slice(0, STOP));

    const extraMatch = notMatchedCSV.slice(0, STOP);

    console.log(extraMatch);

    const extra = await extraMatchTitles(extraMatch);

    extraMatch.reduce((acc, el, ix) => {
        if (ix % 100 === 0) {
            acc.push([]);
        }

        acc[acc.length - 1].push(el);

        return acc;
    }, []).forEach(a => console.log(a));

    // console.log(extraMatch.slice(0, STOP / 2));
    // console.log(extraMatch.slice(STOP / 2));

    debugger;
    const notMatchedAtAll = notMatchedCSV.filter(id => !Boolean(extra.find(e => e.id === id)));

    console.log(notMatchedAtAll.length);

}

main();
