const fastcsv = require('fast-csv');
const fs = require('fs');

async function salvarResultado(results){

    // Escrevendo os resultados em um novo arquivo CSV
    const ws = fs.createWriteStream('arquivos-csv/resultado.csv');
    fastcsv.write(results, { headers: true }).pipe(ws);

}

exports.salvarResultado = salvarResultado;