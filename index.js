const lerCsv = require('./src/csv/lerCsv');
const { salvarResultado } = require('./src/csv/gravarCsv');
const { scrapper } = require('./src/scrapper/scrapper');

async function main() {
  const userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'; // Definindo o User-Agent personalizado

  // Lendo o arquivo CSV e coletando as URLs
  const urls = await lerCsv.pegarListaDeUrls();
  
  //acessando a lista de urls e coletando informações
  const results = await scrapper(urls, userAgent);

  //salvando o resultado no arquivo csv
  await salvarResultado(results);

  console.log('Verificação de URLs concluída. Resultados salvos em resultado.csv');   
}

main();
