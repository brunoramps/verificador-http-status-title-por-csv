# http-status-code-checker
 Ferramenta que acessa uma lista de URLs em um CSV e retorna o http status code de cada uma delas, se for um redirect, ela te mostra o código e a url de destino, exportando em um CSV

 # Instalar dependências
 npm install

 # Rodar a aplicação 
 npm start

 # Como gerar a lista de URLs

 - Dentro da pasta arquivos-csv, crie um arquivo (já existe um exmeplo lá) com o nome urls.csv
 - A primeira linha precisa ser exatamente "url", pois é o título da coluna
 - Da segunda linha adiante, coloque as urls separadas por linha (sem vírgulas).

 # Resultado
 Quando a ferramenta terminar a verificação, vai gerar um arquivo .csv dentro da pasta arquivos-csv com o nome resultado.csv
