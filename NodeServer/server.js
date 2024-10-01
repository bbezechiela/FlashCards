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
  database: 'flashcardsdb',
  port: 14893
});

conn.connect((err) => {
  if (err) throw err;
  console.log('connected to mysql');

  // const createUserTable = `CREATE TABLE IF NOT EXISTS user (uid VARCHAR(255) PRIMARY KEY, user_id int UNIQUE, display_name VARCHAR(255), email VARCHAR(255), profile_path VARCHAR(255))`;

  // const createCategory = `CREATE TABLE IF NOT EXISTS category (category_id INT PRIMARY KEY AUTO_INCREMENT, uid VARCHAR(255), category_name VARCHAR(100), number_of_cards INT, category_status VARCHAR(20), category_timestamp DATETIME, FOREIGN KEY (uid) REFERENCES user(uid))`;

  // const createCategoryQa = `CREATE TABLE IF NOT EXISTS category_qa (qa_id INT PRIMARY KEY AUTO_INCREMENT, category_id INT, uid VARCHAR(255), question VARCHAR(255), answer VARCHAR(255), qa_timestamp DATETIME, FOREIGN KEY (uid) REFERENCES user(uid), FOREIGN KEY (category_id) REFERENCES category(category_id))`;

  // conn.query(createUserTable, (err, result) => {
  //   if (err) throw err;
  //   console.log('table user createdd');
  // });

  // conn.query(createCategory, (err, result) => {
  //   if (err) throw err;
  //   console.log('table user category');
  // });

  // conn.query(createCategoryQa, (err, result) => {
  //   if (err) throw err;
  //   console.log('table user category qa');
  // });
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

let corsOptions = {
  origin: 'https://flashcards-uvlr.onrender.com',
  methods: 'GET, POST, OPTIONS',
  allowedHeaders: 'Content-Type',
}

app.use(cors(corsOptions));
// app.options('*', cors());

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.set('Cross-Origin-Opener-Policy', 'same-origin');
//   res.set('Cross-Origin-Embedder-Policy', 'require-corp'); 
//   next(); 
// });

app.post('/createUserLocal', (req, res) => {
  console.log(req.body);
  let {uid, displayName, email, photoURL} = req.body;
  displayName = displayName.replace(/'/g, "''");
  const insertQuery = `INSERT INTO user (uid, display_name, email, profile_path) VALUES ('${uid}', '${displayName}', '${email}', '${photoURL}')`;

  conn.query(`SELECT uid FROM user WHERE uid = '${uid}'`, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      conn.query(insertQuery, (err, result) => {
        if (err) throw err;
        res.json({message: 'user created localy'});
      });
    } else {
      res.json({message: 'user exist'});
    }
  });

});

app.get('/demoPostMan', (req, res) => {
  conn.query('SELECT * FROM user WHERE user_id = 0', (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

app.post('/createCards', (req, res) => {
  conn.query = util.promisify(conn.query);
  let data = req.body;

  (async () => {
    const firstQuery = await conn.query(`INSERT INTO category (uid, category_name, number_of_cards, category_status, category_timestamp) VALUES ('${data.uid}', '${data.title}', ${data.numberOfCards}, 'active', '${getDate()}')`).then((result) => { return [result.insertId] });

    firstQuery.map((e) => {
      for (let i of data.allCards) {
        conn.query(`INSERT INTO category_qa (category_id, uid, question, answer, qa_timestamp) VALUES (${e}, '${data.uid}', '${i.cardQuestion}', '${i.cardAnswer}', '${getDate()}')`, (err) => {
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

  conn.query(`SELECT * FROM category_qa WHERE category_id = ${cardId}`, (err, result) => {
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

  conn.query(`DELETE FROM category_qa WHERE category_id = ${categoryId}`, (err, result) => {
    if (err) throw err;
    console.log(result);

    conn.query(`DELETE FROM category WHERE category_id = ${categoryId}`, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json({message: 'Both fr and pr records are deleted'});      
    });
  });
});
