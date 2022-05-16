var express = require('express');
var app = express();
var data = [];
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', (req, res) => {
  res.render('pages/index', {
    data: data
  });
});

app.get('/error', (req, res) => {
  res.render('pages/error', {
    
  });
});

app.use(express.json());
app.use(express.urlencoded());

app.post('/', (req, res)=> {
  data.push({
    name: req.body.name,
    age: req.body.age,
    description: req.body.description
  })
  res.redirect('/')
});


app.use((req, res, next) => {
  res.redirect('/error')
})




app.listen(port);