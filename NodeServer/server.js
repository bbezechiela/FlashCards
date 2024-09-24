import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import util from 'util';

const app = express();

const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'happyme123',
  database: 'flashcarddb',
  connectionLimit: 10,
});

const getDate = () => { 
  const date = new Date();
  let year = date.toLocaleDateString('default', { year: 'numeric' });  
  let month = date.toLocaleDateString('default', { month: '2-digit' });  
  let day = date.toLocaleDateString('default', { day: '2-digit' });  

  const currentDate = `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

  return currentDate;
}

conn.connect((err) => {
  if (err) throw err;
  console.log('connected to mysql');
});

app.listen(2020, () => console.log('connected to server'));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

app.post('/createCards', (req, res) => {
  conn.query = util.promisify(conn.query);
  let arr = req.body;

  (async () => {
    const firstQuery = await conn.query(`INSERT INTO category (user_id, category_name, number_of_cards, category_status, category_timestamp) VALUES (1, '${arr.title}', ${arr.numberOfCards},'active', '${getDate()}')`).then((result) => { return [result.insertId] });

    firstQuery.map((e) => {
      for (let i of arr.allCards) {
        conn.query(`INSERT INTO category_QA (category_id, user_id, question, answer, qa_timestamp) VALUES (${e}, 5, '${i.cardQuestion}', '${i.cardAnswer}', '${getDate()}')`, (err) => {
          if (err) throw err;
        });
      }
    });
    console.log(req.body);
    res.json({message: 'inserted'});
  })();
});

app.get('/getAllSetCards', (req, res) => {
  conn.query('SELECT * FROM category WHERE category_id > 0', (err, result) => {
    if (err) throw err;
    res.json({message: result});
  });
});

app.get('/getCards', (req, res) => {
  const cardId = req.query.cardId;

  console.log(cardId);
  conn.query(`SELECT * FROM category_QA WHERE category_id = ${cardId}`, (err, result) => {
    if (err) throw err;

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    console.log(result);
    res.json({message: result})
  });
});

app.post('/deleteCard', (req, res) => {
  const categoryId = req.query.categoryId;

  conn.query(`DELETE FROM category_QA WHERE category_id = ${categoryId}`, (err, result) => {
    if (err) throw err;
    console.log(result);

    conn.query(`DELETE FROM category WHERE category_id = ${categoryId}`, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json({message: 'Both fr and pr records are deleted'});      
    });
  });
});