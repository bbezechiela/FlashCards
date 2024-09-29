import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import util from 'util';
import cors from 'cors';

const app = express();

const conn = mysql.createConnection({
  host: 'mysql-388bb08e-imoflashcards.j.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_a7IiP1LtJ7QM4qAytXl',
  database: 'defaultdb',
  port: 14893
});

conn.connect((err) => {
  if (err) throw err;
  console.log('connected to mysql');
});

const getDate = () => { 
  const date = new Date();
  let year = date.toLocaleDateString('default', { year: 'numeric' });  
  let month = date.toLocaleDateString('default', { month: '2-digit' });  
  let day = date.toLocaleDateString('default', { day: '2-digit' });  

  const currentDate = `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

  return currentDate;
}

app.listen(2020, () => console.log('connected to server'));

let corsOption = {
  origin: 'http://localhost:5173',
}

app.use(cors(corsOption));

app.use(bodyParser.json());

app.post('/createUserLocal', (req, res) => {
  const {uid, displayName, email, photoURL} = req.body;  
  const insertQuery = `INSERT INTO user (uid, display_name, email, profile_path) VALUES ('${uid}', "${displayName}", '${email}', '${photoURL}')`;

  conn.query(`SELECT uid FROM user WHERE uid = '${uid}'`, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      conn.query(insertQuery, (err) => {
        if (err) throw err;
        res.json({message: 'user created localy'});
      })
    }
  });
});

app.post('/createCards', (req, res) => {
  conn.query = util.promisify(conn.query);
  let data = req.body;

  (async () => {
    const firstQuery = await conn.query(`INSERT INTO category (uid, category_name, number_of_cards, category_status, category_timestamp) VALUES ('${data.uid}', '${data.title}', ${data.numberOfCards}, 'active', '${getDate()}')`).then((result) => { return [result.insertId] });

    firstQuery.map((e) => {
      for (let i of data.allCards) {
        conn.query(`INSERT INTO category_QA (category_id, uid, question, answer, qa_timestamp) VALUES (${e}, '${data.uid}', '${i.cardQuestion}', '${i.cardAnswer}', '${getDate()}')`, (err) => {
          if (err) throw err;
        });
      }
    });
    console.log(req.body);
    res.json({message: 'inserted'});
  })();
});

app.get('/getAllSetCards', (req, res) => {
  const uid = req.query.uid;

  conn.query(`SELECT * FROM category WHERE uid = '${uid}'`, (err, result) => {
    if (err) throw err;
    res.json({message: result});
  });
});

app.get('/getCards', (req, res) => {
  const cardId = req.query.cardId;

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
