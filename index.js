const { gotScraping } = require('got-scraping');
const fs =  require('fs');
const buffer =  require('buffer');

async function start() {
    const response = await gotScraping({
        responseType: 'json',
        url: 'https://mapi.mobilelegends.com/hero/list',
    });

    const data = response.body["data"];
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            const image = await gotScraping({
                responseType: 'buffer',
                url: `https:${element["key"]}`
            });
            var filename = image.url.split('/').pop().split('#')[0].split('?')[0];

            fs.writeFile(`HeroIcon/${element["name"]}.${filename.split(".")[1]}`, image.body, "binary", (err) => {
                if (err) throw err;
                console.log(`${element["name"]}: ${filename}`);
            });
            

        }
    }
}

start();