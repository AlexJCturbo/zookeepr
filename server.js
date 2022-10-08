//Require Express.js
const express = require('express');
const path = require('path');

//Requiring the data
const { animals } = require('./data/animals.json');

const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//available (like css and js files in this case)
app.use(express.static('public'));


//This route will take us to /animals
//The endpoint here is just /animals
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

//This route will take us to /zookepers
app.get('/zookepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookepers.html'));
});

//Wildcard Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//Getting index.html to be served from our Express.js server
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});