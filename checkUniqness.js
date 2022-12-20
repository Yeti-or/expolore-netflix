

const { loadCSVData } = require('./data-layer/csvData');
const { loadUNOData } = require('./data-layer/unoData');


async function main() {

    // check uniqness of csv data
    const { csvTitles } = await loadCSVData();

    const uniqTitles = new Map();
    const notUniq = new Map();

    for (const [show_id, csv] of csvTitles) {
        const { title } = csv;
        if (uniqTitles.has(title)) {
            notUniq.set(title, (notUniq.get(title) || []).concat(csv));
        } else {
            uniqTitles.set(title, csv);
        }
    }

    console.log(uniqTitles.size);
    console.log(notUniq.size);

    // check uniqness of uno data
    const { unoTitles } = await loadUNOData();

    const uniqUNOTitles = new Map();
    const notUniqUNO = new Map();

    for (const [id, uno] of unoTitles) {
        const { title } = uno;
        if (uniqUNOTitles.has(title)) {
            if (notUniqUNO.has(title)) {
                notUniqUNO.set(title, (notUniqUNO.get(title) || []).concat(uno));
            } else {
                notUniqUNO.set(title, [uniqUNOTitles.get(title), uno]);
            }
        } else {
            uniqUNOTitles.set(title, uno);
        }
    }

    console.log(uniqUNOTitles.size);
    console.log(notUniqUNO.size);

    console.log();
    if (false) {
        for (const [title, unos] of notUniqUNO) {
            console.log(title);
            unos.forEach(uno => console.log(uno));
            console.log();
            console.log();
        }
    }

}

main();
