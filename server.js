const express = require('express');
const app = express();
let data = [];
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index', {
    data: data
  });
});

app.get('/ouderen', (req, res) => {
  res.render('pages/old-people', {
    data: data
  });
});

app.get('/zorgmedewerker', (req, res) => {
  res.render('pages/care-giver', {
    data: data
  });
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

app.use(express.json());
app.use(express.urlencoded());

app.post('/', (req, res)=> {
  data.push({
    name: req.body.name,
  })
  res.redirect('/')
});

app.use((req, res, next) => {
  res.redirect('/error')
})

app.listen(port);