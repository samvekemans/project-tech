const express = require('express');
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
let  db;

const app = express();
const port = process.env.PORT || 3000;
let query = {};

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
  
app.get('/', async (req, res) => {
  
  res.render('pages/index');
});

app.get('/ouderen', (req, res) => {
  const radioTitle = 'Waar zoekt u naar?';
  const slider = {
    title: 'Ervaring Zorgmedewerker',
    min: 1,
    max: 100,
  };
  res.render('pages/register', {
    radioTitle,
    slider,
  });
});

app.get('/zorgmedewerker', (req, res) => {
  const radioTitle = 'Wat wil je doen?';
  const slider = {
    title: 'Leeftijd van de oudere',
    min: 50,
    max: 100,
  };
  res.render('pages/register', {
    radioTitle,
    slider,
  });
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

app.get('/users', async(req, res) => {
  const users = await db.collection("profiles").find(query).toArray();

  res.render('pages/users', {
    users,
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async(req, res) => {
  let user = {
    name: req.body.name,
    age: req.body.age,
    aboutUser: req.body.description,
    help: req.body.help
  }

  try{
    await db.collection("profiles").insertOne(user);
  }
  catch(error){
    console.log(error);
  }
  
  query = {
    help: req.body.help
  },

  res.redirect('/users');
});

app.use((req, res, next) => {
  res.status(404);
  res.redirect('/error');
});

async function conectDB(){
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  catch (error){
    throw error
  }
};

app.listen(port, () => {
  conectDB()
});
