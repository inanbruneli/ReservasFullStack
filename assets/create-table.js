const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'mysql937.umbler.com',
  port: 41890,
  user: 'inanbrunelli',
  password: '34652921inan',
  database: 'bdinan'
});

connection.connect(function (err) {
  if (err) return console.log(err);
  reset(connection);

  createReserva(connection);
  createSala(connection);
  createParticipante(connection);
  createSalaParticipante(connection);
  addRows(connection);
})

function reset(conn) {
  let sql = "DROP TABLE reserva;";
  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
  sql = "DROP TABLE sala;";
  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
  sql = "DROP TABLE participante;";
  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
  sql = "DROP TABLE sala_participante;";
  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
}

function createReserva(conn) {
  const sql = "CREATE TABLE IF NOT EXISTS reserva (" +
    "idreserva int NOT NULL AUTO_INCREMENT," +
    "horario time NOT NULL," +
    "termino time NOT NULL," +
    "idsala int NOT NULL," +
    "PRIMARY KEY (idreserva)" +
    ");";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
}

function createSala(conn) {
  const sql = "CREATE TABLE IF NOT EXISTS sala (" +
    "idsala int NOT NULL AUTO_INCREMENT," +
    "descricao char(150) NOT NULL," +
    "PRIMARY KEY (idsala)" +
    ");";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
}

function createParticipante(conn) {
  const sql = "CREATE TABLE IF NOT EXISTS participante (" +
    "idparticipante int NOT NULL AUTO_INCREMENT," +
    "nome char(150) NOT NULL," +
    "foto char(150) NOT NULL," +
    "PRIMARY KEY (idparticipante)" +
    ");";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
}

function createSalaParticipante(conn) {
  const sql = "CREATE TABLE IF NOT EXISTS sala_participante (" +
    "idsala_participante int NOT NULL AUTO_INCREMENT," +
    "idsala int NOT NULL," +
    "idparticipante int NOT NULL," +
    "idreserva int NOT NULL," +
    "PRIMARY KEY (idsala_participante)" +
    ");";

  conn.query(sql, function (error, results, fields) {
    if (error) return console.log(error);
  });
}

function addRows(conn) {
  let sql = "INSERT INTO sala (descricao) VALUES ?";
  let values = [
    ['Sala 01'],
    ['Sala 02'],
    ['Sala 03'],
    ['Sala 04']
  ];
  conn.query(sql, [values], function (error, results, fields) {
    if (error) return console.log(error);
  });

  sql = "INSERT INTO participante (nome, foto) VALUES ?";
  values = [
    ['Inan Brunelli', 'inan.jpg'],
    ['Victor Gomes', 'victor.jpg'],
    ['Marcos Macedo', 'marcos.jpg'],
  ];
  conn.query(sql, [values], function (error, results, fields) {
    if (error) return console.log(error);
  });

  sql = "INSERT INTO reserva (horario, termino, idsala) VALUES ?";
  values = [
    ['10:10', '11:15', '1'],
    ['09:45', '12:50', '2'],
    ['13:50', '14:30', '3'],
  ];
  conn.query(sql, [values], function (error, results, fields) {
    if (error) return console.log(error);
  });

  sql = "INSERT INTO sala_participante (idsala, idparticipante, idreserva) VALUES ?";
  values = [
    ['1', '1', '1'],
    ['1', '2', '1'],
    ['2', '3', '2'],
    ['3', '1', '3'],
    ['3', '2', '3'],
    ['3', '3', '3'],
  ];
  conn.query(sql, [values], function (error, results, fields) {
    if (error) return console.log(error);
    conn.end();//fecha a conexão
  });
}



