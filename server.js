const express = require('express');
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const path = require('path')
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: `${__dirname}/public/uploads`,
  filename: function (req, file, cb) {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
      storage: storage
  }).single('pictureUser');

let  db;
const port = process.env.PORT || 3000;
let query = {};
let oldTradesTitle = '';
let careTradesTitle = '';

const app = express();

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
  
app.get('/', async (req, res) => {
  res.render('pages/index');
});

app.get('/ouderen', (req, res) => {
  const iconTitles = {
    first: 'Welke eigenschappen verwacht je van de zorgmedewerker?',
    second: 'Welke eigenschappen passen het beste bij jou?'
  };
  const valueType = "ouderen";
  const radioTitle = 'Waar zoekt u naar?';
  const trades = { 
    first: 'oldPersonTrades[]',
    second: 'careGiverTrades[]'
  };

  res.render('pages/register', {
    radioTitle,
    valueType,
    trades,
    iconTitles,
  });
});

app.get('/zorgmedewerker', (req, res) => {
  const iconTitles = {
    first: 'Welke eigenschappen passen het beste bij jou?',
    second: 'Welke eigenschappen verwacht je van de oudere persoon?'
  };
  const valueType = "zorgmedewerker";
  const radioTitle = 'Wat wil je doen?';
  const trades = { 
    first: 'careGiverTrades[]',
    second: 'oldPersonTrades[]'
  };

  res.render('pages/register', {
    radioTitle,
    valueType,
    trades,
    iconTitles,
  });
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

app.get('/users', async(req, res) => {
  const users = await db.collection("profiles").find(query).toArray();

  res.render('pages/users', {
    users,
    oldTradesTitle,
    careTradesTitle,
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/ouderen', upload, async(req, res) => {
  let user = {
    accountType: req.body.account,
    name: req.body.name,
    age: req.body.age,
    aboutUser: req.body.description,
    help: req.body.help,
    image: 'uploads/' + req.file.filename,
    oldTrades: req.body.oldPersonTrades,
    careTrades: req.body.careGiverTrades
  }

  try{
    await db.collection("profiles").insertOne(user);
  }
  catch(error){
    throw error
  }

  if(req.body.account === 'ouderen'){
    careTradesTitle = 'Mijn eigenschappen:'
    oldTradesTitle = 'De zorgmedewerker wil dit graag van de ouderen:'
  }
  if(req.body.account === 'zorgmedewerker'){
    oldTradesTitle = 'Mijn eigenschappen:'
    careTradesTitle = 'Wat de ouderen verwacht van jou:'
  }

  query = {
    accountType: req.body.account === 'ouderen' ? 'zorgmedewerker' : 'ouderen',
    oldTrades:{ $in: req.body.oldPersonTrades},
    careTrades:{ $in: req.body.careGiverTrades},
    help: {$in: req.body.help},
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
