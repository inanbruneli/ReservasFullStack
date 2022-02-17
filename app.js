const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mysql = require('mysql');
const cors = require('cors');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.get('/', function (req, res) {
  res.json({ message: 'API Online!' });
});

app.use('/', router);
app.listen(port);

router.get('/salas', (req, res) => {
  sql('SELECT * FROM sala', res);
});

router.get('/reservas/:id?', (req, res) => {
  let filter = req.params.id ? ' WHERE r.idreserva = ' + parseInt(req.params.id) : '';
  const query =
    'SELECT r.idreserva, r.horario, r.termino, s.idsala, s.descricao FROM reserva r ' +
    'INNER JOIN sala s ON s.idsala = r.idsala ' + filter +
    ' ORDER BY idreserva';

  sql(query, res);
});

router.get('/participantes_sala/:id?', (req, res) => {
  let filter = req.params.id ? ' WHERE idreserva = ' + parseInt(req.params.id) : '';
  const query =
    'SELECT * FROM sala_participante sp ' +
    'INNER JOIN participante p ON p.idparticipante = sp.idparticipante ' + filter;

  sql(query, res);
});

router.get('/participantes_reserva/:id', (req, res) => {
  const query =
    'SELECT * FROM participante ' +
    'WHERE idparticipante IN ( ' +
    'SELECT idparticipante FROM sala_participante ' +
    'WHERE idreserva = ' + parseInt(req.params.id) + ')';

  sql(query, res);
});

router.get('/delete_participantes/:idparticipante&:idreserva', (req, res) => {
  const query =
    'DELETE FROM sala_participante ' +
    ' WHERE idreserva = ' + parseInt(req.params.idreserva) +
    ' AND idparticipante IN (' + parseInt(req.params.idparticipante) + ')';

  sql(query, res);
});

router.get('/nova_sala/:descricao', (req, res) => {
  const query =
    "INSERT INTO sala (descricao) " +
    " VALUES ('" + (req.params.descricao) + "');";

  sql(query, res);
});

router.get('/ultima_sala', (req, res) => {
  const query =
    "SELECT idsala FROM sala ORDER BY idsala DESC LIMIT 1";

  sql(query, res);
});

router.get('/perticipantes_disponiveis/:idreserva', (req, res) => {
  const query =
    "SELECT * FROM participante " +
    " WHERE idparticipante NOT IN " +
    " (SELECT idparticipante FROM sala_participante WHERE idreserva = " + parseInt(req.params.idreserva) + " )";

  sql(query, res);
});

router.get('/novo_participante/:idparticipante&:idreserva&:idsala', (req, res) => {
  const query =
    "INSERT INTO sala_participante (idparticipante, idreserva, idsala) " +
    "VALUES (" + parseInt(req.params.idparticipante) + " , " +
    parseInt(req.params.idreserva) + " , " +
    parseInt(req.params.idsala) + " ) ";

  sql(query, res);
});


router.get('/update_reserva/:horario&:termino&:idsala&:idreserva', (req, res) => {
  const query =
    "UPDATE reserva SET " +
    "horario = '" + (req.params.horario) + "' , " +
    "termino = '" + (req.params.termino) + "' , " +
    "idsala = '" + (req.params.idsala) + "' " +
    "WHERE idreserva = " + parseInt(req.params.idreserva);

  sql(query, res);
});

router.get('/nova_reserva', (req, res) => {
  const query =
    "INSERT INTO reserva (idsala) VALUES (0)";
  sql(query, res);
});

router.get('/ultima_reserva', (req, res) => {
  const query =
    "SELECT idreserva FROM reserva ORDER BY idreserva DESC LIMIT 1";

  sql(query, res);
});

router.get('/delete_reserva/:idreserva', (req, res) => {
  const query =
    "DELETE FROM reserva" +
    " WHERE idreserva = " + parseInt(req.params.idreserva);

  sql(query, res);
});

router.get('/delete_reserva_participantes/:idreserva', (req, res) => {
  const query =
    "DELETE FROM sala_participante " +
    " WHERE idreserva = " + parseInt(req.params.idreserva);

  sql(query, res);
});


function sql(sqlQry, res) {
  const connection = mysql.createConnection({
    host: 'mysql937.umbler.com',
    port: 41890,
    user: 'inanbrunelli',
    password: '34652921inan',
    database: 'bdinan'
  });

  connection.query(sqlQry, function (error, results, fields) {
    if (error)
      res.json(error);
    else
      res.json(results);
    connection.end();
    //console.log('executou!');
  });
}