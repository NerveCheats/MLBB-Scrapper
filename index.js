const { gotScraping } = require('got-scraping');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };

async function start() {
    const response = await gotScraping({
        url: 'https://mobile-legends.fandom.com/wiki/List_of_heroes',
    });

    const $ = cheerio.load(response.body);
    const listHero = ($('.fandom-table > tbody td:nth-child(1) > a'));
    listHero.each(function (i, e) {
        const image = $(e).find("img");
        const nameHero = $(e).attr("title");
        const fileExtension = image.attr("data-image-name").split(".").pop();
        
        download(image.attr("data-src"),`HeroIcon/${nameHero}.${fileExtension}`, (err) => {
            if (err) throw err;
            console.log(`${nameHero}.${fileExtension}`);
        });
    });
}

start();