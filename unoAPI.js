
const axios = require("axios");

const { saveCache, loadCache } = require('./data-layer/cache');

async function searchTitle(title) {

    const cacheKey = { key: title, method: 'search' };
    const cache = await loadCache(cacheKey);

    if (cache) {
        return cache;
    }

    console.log();
    console.log('LOAD FROM API!!! >>', title);
    console.log();

    return new Promise((res, rej) => {
        setTimeout(async () => {
            console.log('Start loading for >', title);

            try {
                const data = await fetchData({ title });
                console.log('Loaded data');

                await saveCache({ ...cacheKey, data });

                res(data);
            } catch (err) {
                console.log('ERROR while saving cache', cacheKey);
                console.log();
                console.log('=== data === ');
                console.log(JSON.stringify(data, null, 4));
                console.log();
                rej(err);
            }
        }, 3000);
    });
}

async function getCountyInfo(netflixid) {

    const cacheKey = { key: netflixid, method: 'titlecountries' };
    const cache = await loadCache(cacheKey);

    if (cache) {
        return cache;
    }

    console.log();
    console.log('LOAD FROM API!!! >>', netflixid);
    console.log();

    return new Promise((res, rej) => {
        setTimeout(async () => {
            console.log('Start loading for >', netflixid);

            try {
                const data = await fetchTitleCountryInfo({ netflixid });
                console.log('Loaded data');

                try {
                    await saveCache({ ...cacheKey, data });
                } catch (err) {
                    console.log('ERROR while saving cache', cacheKey);
                    console.log();
                    console.log('=== data === ');
                    console.log(JSON.stringify(data, null, 4));
                    console.log();
                    rej(err);
                }

                res(data);
            } catch (err) {
                console.log('ERROR while loading data ', cacheKey);
                console.log();
                rej(err);
            }
        }, 500);
    });
}

module.exports = {
    searchTitle,
    getCountyInfo
};


const RAPID_API_KEY = process.env.RAPID_API_KEY;

if (!RAPID_API_KEY) {
    throw 'PROVIDE RAPID_API_KEY @see: https://rapidapi.com/unogs/api/unogsng';
}

async function fetchData({ title }) {

    const options = {
      method: 'GET',
      url: 'https://unogsng.p.rapidapi.com/search',
      params: {
        query: title
      },
      headers: {
        'X-RapidAPI-Key': 'f414d2cf49mshe84b81985ad76aap192fb2jsn88b9df9040c0',
        'X-RapidAPI-Host': 'unogsng.p.rapidapi.com'
      }
    };

    try {
        const response = await axios.request(options);

        if (response && response.data) {
            return response.data;
        }

        console.log();
        console.log();
        console.log();
        console.log();
        console.log('DO SOMETHING!!!!');

        console.log(response);
        console.log(JSON.stringify(response));

        // yes fail if or we will spend money
        process.exit();
    } catch (err) {
        console.log();
        console.log();
        console.log();
        console.log();
        console.log('DO SOMETHING!!!!');

        console.log(err);
        console.log(JSON.stringify(err));

        // yes fail if or we will spend money
        process.exit();
    }
}

async function fetchTitleCountryInfo({ netflixid }) {

    const options = {
      method: 'GET',
      url: 'https://unogsng.p.rapidapi.com/titlecountries',
      params: {
        netflixid
      },
      headers: {
        'X-RapidAPI-Key': 'f414d2cf49mshe84b81985ad76aap192fb2jsn88b9df9040c0',
        'X-RapidAPI-Host': 'unogsng.p.rapidapi.com'
      }
    };

    try {
        const response = await axios.request(options);

        if (response && response.data) {
            return response.data;
        }

        console.log();
        console.log();
        console.log();
        console.log();
        console.log('DO SOMETHING!!!!');

        console.log(response);
        console.log(JSON.stringify(response));

        // yes fail if or we will spend money
        process.exit();
    } catch (err) {
        console.log();
        console.log();
        console.log();
        console.log();
        console.log('DO SOMETHING!!!!');

        console.log(err);
        console.log(JSON.stringify(err));

        // yes fail if or we will spend money
        process.exit();
    }
}


async function fetchTestData({ title }) {
    return {
      results: [
        {
          id: 66836,
          title: 'Dick Johnson Is Dead',
          img: 'https://occ-0-2851-1432.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABZ4hzAxIwBc9VnUL3_RnZuf_0HxQ0Qq0-_Hh_Plp9xWacSBp_L76A7ixjwHOypHGbVzUy_5yRGnx0j-ILwhGH3dxWjk8PppCAcCeLx2WMLWs_g2-KWPxdB9ljXk.jpg?r=4f7',
          vtype: 'movie',
          nfid: 80234465,
          synopsis: 'As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.',
          avgrating: 0,
          year: 2020,
          runtime: 5403,
          imdbid: 'tt11394180',
          poster: 'https://m.media-amazon.com/images/M/MV5BYzY5YjcxMzYtZDgxMS00ZjUyLWFmYjItYTNmZTU3ODAwMzBkXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg',
          imdbrating: 6.9,
          top250: 0,
          top250tv: 0,
          clist: '"CA":"Canada","FR":"France","DE":"Germany","NL":"Netherlands","PL":"Poland","GB":"United Kingdom","US":"United States","AR":"Argentina","AU":"Australia","BE":"Belgium","more":"+27"',
          titledate: '2020-10-02'
        },
        {
          id: 43737,
          title: 'Anjelah Johnson: Not Fancy',
          img: 'http://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABb0Kf_y_jJUaDGZtujuDi9n99piMt5d4G65_jZU93Yb75HSA6TbttOgnzlmZnOPjM9A4BrRjh3QfKATdatmD4gis-Nn6HOE_SA4J6zwxQKwVNprKb4axiYaIC5E.jpg?r=4e0',
          vtype: 'movie',
          nfid: 80046779,
          synopsis: 'Actress and comedian Anjelah Johnson showcases her hilarious impressions to riff on European Gypsies, Vietnamese manicurists, Mexican moms, and more.',
          avgrating: 3,
          year: 2015,
          runtime: 3825,
          imdbid: 'tt4199110',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BODVkNDE4ZTQtNTcyMS00OTI4LWI4NjMtYmI2ZjVlNGMxZTNjXkEyXkFqcGdeQXVyMTQxMzY0ODY@._V1_SX300.jpg',
          imdbrating: 5.8,
          top250: 0,
          top250tv: 0,
          clist: '"DE":"Germany","AR":"Argentina","BE":"Belgium","CZ":"Czech Republic","IS":"Iceland","IL":"Israel","IT":"Italy","JP":"Japan","MX":"Mexico","RO":"Romania","more":"+4"',
          titledate: '2015-10-02'
        },
        {
          id: 55217,
          title: 'The Death and Life of Marsha P. Johnson',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABZ0e0Z67EVosEW3GNOrH90cfXuhcVsAOg2I57_XOh8Btzb1OdDxLc9ozZlgEGkQMZ6TNPhXRcsEpTVlZauTOjSk9fvWls7uE6GASqJ2FshYhSWydntEZX2zy8kU.jpg?r=7b1',
          vtype: 'movie',
          nfid: 80189623,
          synopsis: 'As she fights the tide of violence against trans women, activist Victoria Cruz probes the suspicious 1992 death of her friend Marsha P. Johnson.',
          avgrating: 0,
          year: 2017,
          runtime: 6348,
          imdbid: 'tt5233558',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BYWI5YjY3ODAtNTRjNC00NjA2LWJiYjQtYjRlOTJiNzU5NTIzXkEyXkFqcGdeQXVyNDY4MzUzMQ@@._V1_SX300.jpg',
          imdbrating: 7.2,
          top250: 0,
          top250tv: 0,
          clist: '"CA":"Canada","FR":"France","DE":"Germany","NL":"Netherlands","PL":"Poland","GB":"United Kingdom","US":"United States","AR":"Argentina","AU":"Australia","BE":"Belgium","more":"+27"',
          titledate: '2017-10-06'
        },
        {
          id: 37752,
          title: 'Fun with Dick and Jane',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABfrTlCq_otSIpWggrRjAYJip_lr-3aQs2AwZbYtgBhnx5O0UFtANNsZhduPZzVD8Sj2yTGxKevnS0fMto41a569jsQ.jpg?r=b97',
          vtype: 'movie',
          nfid: 70021643,
          synopsis: 'After losing their high-paying corporate jobs, an upwardly mobile couple turns to robbing banks to maintain their standard of living.',
          avgrating: 3.3527026,
          year: 2005,
          runtime: 5418,
          imdbid: 'tt0369441',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BYTJiMWFiNzgtMDQxZi00NTFiLWE2YjMtNTA5NzY5YzQxZjNjXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg',
          imdbrating: 6.1,
          top250: 0,
          top250tv: 0,
          clist: '"AR":"Argentina","BR":"Brazil","CO":"Colombia","HK":"Hong Kong","LT":"Lithuania","MY":"Malaysia","MX":"Mexico","PH":"Philippines","SG":"Singapore","TH":"Thailand","more":"+1"',
          titledate: '2015-04-14'
        },
        {
          id: 57867,
          title: 'Eric ldle&#39;s What About Dick?',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABb35ex_oPjHoJV1kRYDWqm83ohohJDqG-15zGsCI4frnmaDDhz7-sB7N1vcXm6DnfwzZWxVlY9T28btH8L2-LFoLvA.jpg?r=7d6',
          vtype: 'movie',
          nfid: 80235999,
          synopsis: 'In a madcap stage play from Monty Python icon Eric Idle, comic greats perform the decline and fall of the British Empire ... as told through a piano.',
          avgrating: 0,
          year: 2012,
          runtime: 4850,
          imdbid: 'tt2520808',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BOWFlN2VmOGQtY2ZiZS00NzUxLWFlODgtYTgxZjY2NTliZDU5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTgwOTE5NDk@._V1_SX300.jpg',
          imdbrating: 7.5,
          top250: 0,
          top250tv: 0,
          clist: '"CA":"Canada","GB":"United Kingdom","US":"United States","AU":"Australia","CZ":"Czech Republic","GR":"Greece","HU":"Hungary","IS":"Iceland","IN":"India","IL":"Israel","more":"+9"',
          titledate: '2018-04-15'
        },
        {
          id: 59202,
          title: 'Cabins in the Wild with Dick Strawbridge',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABej5F5u3XO7GtyMBrDone7g1_rgJeLm2YRZg-4LwitxzMfdcio1XQvFu8vgVcRsy8W0-tBXXuEeROIsOFHEHuHVf-A.jpg?r=712',
          vtype: 'series',
          nfid: 80241102,
          synopsis: 'Engineer Dick Strawbridge and craftsman Will Hardie tour eight unique cabins built for a pop-up hotel in Wales, and construct No. 9 on their own.',
          avgrating: 0,
          year: 2017,
          runtime: 0,
          imdbid: 'tt8422396',
          poster: null,
          imdbrating: null,
          top250: 0,
          top250tv: 0,
          clist: '"GB":"United Kingdom"',
          titledate: '2018-09-15'
        },
        {
          id: 59997,
          title: 'ReMastered: Tricky Dick and The Man in Black',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABTr280vJwk8iMH5S4wg23swt3SzgGg6dGDZZQQgHLoUn-E6sPFk6vme4GWGHcoG7WdwcGr5r-miFQcidthzzrczVHws41ISUENdYRnvJ04ZM9rwJjOSFt67PHHk.jpg?r=9ae',
          vtype: 'movie',
          nfid: 80191051,
          synopsis: 'This documentary chronicles Johnny Cash&#39;s 1970 visit to the White House, where Cash&#39;s emerging ideals clashed with Richard Nixon&#39;s policies.',
          avgrating: 0,
          year: 2018,
          runtime: 3512,
          imdbid: 'tt9046556',
          poster: 'https://m.media-amazon.com/images/M/MV5BZWI0M2YxNmQtODExMC00NzZjLWI3ZjAtZmQyYWRlMmRmNzVlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
          imdbrating: 7.6,
          top250: 0,
          top250tv: 0,
          clist: '"CA":"Canada","FR":"France","DE":"Germany","PL":"Poland","GB":"United Kingdom","US":"United States","AR":"Argentina","AU":"Australia","BE":"Belgium","BR":"Brazil","more":"+23"',
          titledate: '2018-11-02'
        },
        {
          id: 73966,
          title: 'Moby Dick',
          img: 'https://occ-0-395-988.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABWIcWbwe-hz_cTzv-CHIm20OwXi8J1S30nhGR0gYlxJMlNC1s0qWF_k6sZEW6gVbQ33hiqVbATabicV1S_HyfH6LfA.jpg?r=ee8',
          vtype: 'movie',
          nfid: 81498450,
          synopsis: 'A bridge explosion covered up as a terrorist attack compels journalists to unmask a group of powerful conspirators who are controlling the government.',
          avgrating: 0,
          year: 2011,
          runtime: 6733,
          imdbid: 'tt0049513',
          poster: 'https://m.media-amazon.com/images/M/MV5BYzIxOWRlYjQtODQ0MS00NjZhLWJiZTUtZmRjZWI3OGNmMTA1XkEyXkFqcGdeQXVyNTEwNDcxNDc@._V1_SX300.jpg',
          imdbrating: 7.3,
          top250: null,
          top250tv: null,
          clist: '"KR":"South Korea"',
          titledate: '2021-09-13'
        },
        {
          id: 26759,
          title: 'Over Her Dead Body',
          img: 'http://art-2.nflximg.net/d3d95/35cddabab7c56e8f04c4b63ee39fc2e6f35d3d95.jpg',
          vtype: 'movie',
          nfid: 70084781,
          synopsis: 'Killed by an ice sculpture at her wedding, Kate grows jealous when her fiancé gets cozy with the psychic he&#39;s hired to contact her beyond the grave.',
          avgrating: 3.2451065,
          year: 2008,
          runtime: 5662,
          imdbid: 'tt0785007',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI3NTgyNjg3NV5BMl5BanBnXkFtZTcwMzg2MzU1MQ@@._V1_SX300.jpg',
          imdbrating: 5.2,
          top250: 0,
          top250tv: 0,
          clist: '"GB":"United Kingdom"',
          titledate: '2015-04-14'
        },
        {
          id: 27105,
          title: 'The Walking Dead',
          img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVMk6RO2KoVEK3zVgJ_6PCCTRzbxktQUNfpzOJCQEgOxSE2CsS0AyOgpm4OWxeXUQfFi80atVsm5-ZfiQN19Biep4w.jpg?r=96e',
          vtype: 'series',
          nfid: 70177057,
          synopsis: 'In the wake of a zombie apocalypse, survivors hold on to the hope of humanity by banding together to wage a fight for their own survival.',
          avgrating: 4.417992,
          year: 2010,
          runtime: 0,
          imdbid: 'tt1520211',
          poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTczMDk1NDYyMV5BMl5BanBnXkFtZTgwNjE1NDU4MDI@._V1_SX300.jpg',
          imdbrating: 8.2,
          top250: 0,
          top250tv: 0,
          clist: '"CA":"Canada","FR":"France","DE":"Germany","NL":"Netherlands","PL":"Poland","US":"United States","AR":"Argentina","BE":"Belgium","BR":"Brazil","CO":"Colombia","more":"+16"',
          titledate: '2015-04-14'
        }
      ],
      total: 65,
      elapse: 0.2834
    };
}
