


const { loadUNOTitles } = require('./loaders/loadUNOTitles');
const { matchTitles } = require('./matchTitles');

async function main(chunks_to_load = 50, chunk_size = 10, chunk = 1) {

    while(chunks_to_load > 0) {
        try {
            const len = await loadUNOTitles(chunk_size, chunk);
            if (len) {
                console.log('SUCCESSFULLY loaded some more titles!', len);
                await matchTitles();
            } else {
                console.log('No more titles loaded');
            }
        } catch (err) {
            console.log('ERROR but why?? ');
            console.log();
            console.log(err);
        }

        chunks_to_load -= chunk_size;
        chunk++;
    }

};


main(10000, 100, 1);




