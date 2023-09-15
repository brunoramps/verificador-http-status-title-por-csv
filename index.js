const fs = require('fs');
const csvParser = require('csv-parser');
const puppeteer = require('puppeteer');
const fastcsv = require('fast-csv');

async function main() {
  const urls = [];
  const userAgent =
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'; // Definindo o User-Agent personalizado

  // Lendo o arquivo CSV e coletando as URLs
  fs.createReadStream('urls.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      if (data.url) {
        urls.push(data.url);
      }
    })
    .on('end', async () => {
      const results = [];

      // Inicializando o Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new' //Usando o novo método de headless do puppeteer
      });
      const page = await browser.newPage();

      // Configurando o User-Agent
      await page.setUserAgent(userAgent);

      // Acessando cada URL e coletando as informações
      for (const url of urls) {
        try {
          console.log(`Verificando URL: ${url}`);
          await page.goto(url, { waitUntil: 'domcontentloaded' });

          const httpStatusCode = await page.evaluate(() => {
            return {
              status: window.location.href,
              title: document.title,
            };
          });

          const result = {
            urlOrigem: url,
            httpStatusCode: httpStatusCode.status.startsWith(url)
              ? 200
              : 301,
            urlRedirect: httpStatusCode.status.startsWith(url)
              ? 'N/A'
              : httpStatusCode.status,
            titlePage: httpStatusCode.title || 'N/A',
          };
          results.push(result);
          console.log(`(OK)Resultado para URL: ${url}`, result);
        } catch (error) {
          console.error(`(ER)Erro ao acessar a URL ${url}: ${error}`);
          results.push({
            urlOrigem: url,
            httpStatusCode: 'N/A',
            urlRedirect: 'N/A',
            titlePage: 'N/A',
          });
        }
      }

      // Fechando o navegador Puppeteer
      await browser.close();

      // Escrevendo os resultados em um novo arquivo CSV
      const ws = fs.createWriteStream('resultado.csv');
      fastcsv.write(results, { headers: true }).pipe(ws);

      console.log('Verificação de URLs concluída. Resultados salvos em resultado.csv');
    });
}

main();
