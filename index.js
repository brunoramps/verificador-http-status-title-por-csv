const lerCsv = require('./src/csv/lerCsv');
const { salvarResultado } = require('./src/csv/gravarCsv');
const { scrapper } = require('./src/scrapper/scrapper');

async function main() {
  const userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'; // Definindo o User-Agent personalizado

  // Lendo o arquivo CSV e coletando as URLs
  const urls = await lerCsv.pegarListaDeUrls();
  
  //acessando a lista de urls e coletando informações
  const results = await scrapper(urls, userAgent);

  //salvando o resultado no arquivo csv
  await salvarResultado(results);

  console.log('Verificação de URLs concluída. Resultados salvos em resultado.csv');   
}

main();
