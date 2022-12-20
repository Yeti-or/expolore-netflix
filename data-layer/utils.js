
const mapToJSON = (map, sortFn = undefined) => {
    const obj = {};
    const keys = [...map.keys()];
    keys.sort(sortFn);
    for (const key of keys) {
        const value = map.get(key);
        obj[key] = value;
    }

    return JSON.stringify(obj, null, 4);
}

const JSONtoMap = (string, sortFn = undefined) => {
    const map = new Map();

    try {
        const obj = JSON.parse(string)
        for (const key of Object.keys(obj).sort(sortFn)) {
            if (Number.isNaN(Number(key))) {
                map.set(key, obj[key]);
            } else {
                map.set(Number(key), obj[key]);
            }
        }
    } catch(err) {
        console.log('ERROR WHILE parsing JSON');
        throw err;
    }

    return map;
}

module.exports = {
    mapToJSON,
    JSONtoMap,
};
