const puppeteer = require('puppeteer');
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
          await page.goto(url, { waitUntil: 'domcontentloaded' });

          const httpStatusCode = await page.evaluate(() => {
            return {
              status: window.location.href,
              title: document.title,
            };
          });

          const result = {
            urlOrigem: url,
            httpStatusCode: httpStatusCode.status.startsWith(url) ? 200 : 301,
            urlRedirect: httpStatusCode.status.startsWith(url) ? 'N/A' : httpStatusCode.status,
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

      return results;
}

exports.scrapper = scrapper;