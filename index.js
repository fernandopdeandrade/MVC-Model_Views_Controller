const express = require("express");
const path = require("path");
const mysql2 = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3001;
const authorController = require('./controllers/authorController');

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Writers",
});

db.connect((err) => {
  if (err) {
    console.log(`Não foi possível conectar ao banco de dados: ${err}`);
  }

  let sql = "SELECT * FROM authors";

  db.query(sql, (_err, results) => {
    console.log(
      `Conectado ao banco de dados!...Quantidade de usuários = ${results.length}`
    );
  });
});

app.get('/authors/new', authorController.newAuthor);
app.post('/authors', authorController.createAuthor);

app.get('/authors', authorController.listAuthors);
app.get('/authors/:id', authorController.showAuthor);

app.get('/authors/:id/edit', authorController.editAuthor);
app.post('/update/author/:id', authorController.updateAuthor);

app.get('/authors/:id/delete', authorController.selectDeleteAuthor);
app.post('/delete/author/:id', authorController.deleteAuthor);

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}`);
});
