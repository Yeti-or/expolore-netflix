
const path = require('path');

const fs = require('fs-extra');
const sanitize = require("sanitize-filename");


const { mapToJSON, JSONtoMap } = require('./utils');

const PATH_TO_DATA = path.resolve('cache');

// TODO: actually it\s quite slow reliazition of cache cause we need to go to fs every time,
// probably we need to have index of cache smth like a Map


async function saveCache({ method, key, data }) {

    const path_to_cache = path.join(PATH_TO_DATA, method, sanitize(key.toString()) + '.json');

    try {
        await fs.writeJSON(path_to_cache, data);
        console.log('SAVED CACHE: ', path_to_cache);
        console.log();
    } catch (err) {
        console.log('ERROR WHILE SAVING CACHE: ', path_to_cache);
        console.log(method, key, data);
        console.log();
        console.log();
        console.log();
        throw err;
    }
}


async function loadCache({ method, key }) {
    const path_to_cache = path.join(PATH_TO_DATA, method, sanitize(key.toString()) + '.json');


    try {
        const exists = await fs.pathExists(path_to_cache);

        if (!exists) {
            console.log('NO CACHE FOR: ', path_to_cache);
            return null;
        }

        const response = await fs.readJSON(path_to_cache);
        console.log('GET CACHE HIT!!! >>', method, key);

        return response;
    } catch (err) {
        console.log('ERROR WHILE LOADING CACHE: ', path_to_cache);
        console.log(method, key);
        console.log();
        console.log();
        console.log();
        throw err;
    }
}


module.exports = {
    saveCache,
    loadCache,
};
