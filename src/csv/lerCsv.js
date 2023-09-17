const fs = require('fs');
const csvParser = require('csv-parser');

async function pegarListaDeUrls(){

    const urls = []

    fs.createReadStream('arquivos-csv/urls.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      if (data.url) {
        urls.push(data.url);
      }
    }).on('end', async () =>{});
    return urls;
}

exports.pegarListaDeUrls = pegarListaDeUrls;