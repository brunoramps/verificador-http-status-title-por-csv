const puppeteer = require('puppeteer');
const axios = require('axios');
async function scrapper(urls, userAgent){

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
          const response = await page.goto(url, { waitUntil: 'networkidle0' });
          const statusCode = response.status();


          const pageInfo = await page.evaluate(() => {
            return {
              locationHref: window.location.href,
              title: document.title,
            };
          });

          const result = {
            urlOrigem: url,
            httpStatusCode: pageInfo.locationHref.startsWith(url) ? statusCode : await getStatus(url),
            urlRedirect: pageInfo.locationHref.startsWith(url) ? 'N/A' : pageInfo.locationHref,
            titlePage: pageInfo.title || 'N/A',
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

      return results;

      async function getStatus(url){
        try {
          const response = await axios.request({
            method: "GET",
            url: url,
            maxRedirects: 0,
            validateStatus: null
          });
          return response.status;
        } catch (err) {
          //Se der erro, a página retorna um html em err.response.data, então não há necessidade de colocar a URL na fila de novo          
          return err.response.status
        }
      }
}

exports.scrapper = scrapper;