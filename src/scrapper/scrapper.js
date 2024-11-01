const puppeteer = require('puppeteer');
const axios = require('axios');
async function scrapperOne(urls, userAgent) {

  const results = [];
  let contador = 1;

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
      console.log(`Verificando [${contador} de ${urls.length}] - [${url}]`);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
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
        destinationUrlStatus: pageInfo.locationHref ? await getStatus(pageInfo.locationHref) : "N/A"
      };
      results.push(result);
      console.log(``, result);
    } catch (e) {
      console.log(`(ER)Erro ao acessar a URL ${url}: ${e}`);

      const msgError = e.toString();
      if (msgError.includes("net::ERR_TOO_MANY_REDIRECTS")) {
        results.push({
          urlOrigem: url,
          httpStatusCode: await getStatus(url),
          urlRedirect: url,
          titlePage: msgError.split(" ")[1],
          destinationUrlStatus: "N/A"
        });
      } else {
        urls.push(url);
        console.log(`${url} adicionada novamente na fila para renderização!`)
      }
    }
    contador++;
  }

  // Fechando o navegador Puppeteer
  await browser.close();

  return results;

  async function getStatus(url) {
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

async function scrapper(urls, userAgent) {

  const results = [];
  let contador = 1;

  // Inicializando o Puppeteer
  const browser = await puppeteer.launch({
    headless: false //Usando o novo método de headless do puppeteer
  });


  // Acessando cada URL e coletando as informações
  for (let i = 0; i <= urls.length; i += 10) {
    await Promise.all([
      start(urls[i], browser, contador, results, urls.length),
      start(urls[i + 1], browser, contador + 1, results, urls.length),
      start(urls[i + 2], browser, contador + 2, results, urls.length),
      start(urls[i + 3], browser, contador + 3, results, urls.length),
      start(urls[i + 4], browser, contador + 4, results, urls.length),
      start(urls[i + 5], browser, contador + 5, results, urls.length),
      start(urls[i + 6], browser, contador + 6, results, urls.length),
      start(urls[i + 7], browser, contador + 7, results, urls.length),
      start(urls[i + 8], browser, contador + 8, results, urls.length),
      start(urls[i + 9], browser, contador + 9, results, urls.length)
    ])
    contador += 10
  }

  // Fechando o navegador Puppeteer
  await browser.close();

  return results;

  async function getStatus(url) {
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

  async function start(url, browser, contador, results, limit) {
    if (contador <= limit) {
      try {
        const page = await browser.newPage();

        // Configurando o User-Agent
        await page.setUserAgent(userAgent);
        console.log(`Verificando [${contador} de ${urls.length}] - [${url}]`);
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
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
          destinationUrlStatus: pageInfo.locationHref ? await getStatus(pageInfo.locationHref) : "N/A"
        };
        results.push(result);
        console.log(``, result);
        await page.close();
      } catch (e) {
        console.log(`(ER)Erro ao acessar a URL ${url}: ${e}`);

        const msgError = e.toString();
        if (msgError.includes("net::ERR_TOO_MANY_REDIRECTS")) {
          results.push({
            urlOrigem: url,
            httpStatusCode: await getStatus(url),
            urlRedirect: url,
            titlePage: msgError.split(" ")[1],
            destinationUrlStatus: "N/A"
          });
        } else {
          urls.push(url);
          console.log(`${url} adicionada novamente na fila para renderização!`)
        }
      }
    }
  }
}

exports.scrapper = scrapper;