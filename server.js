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


app.get('/api/animals', (req, res) => {
  //res.json(animals);
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  console.log(req.query);
  res.json(results);
});


app.get('/api/animals/:id', (request, response) => {
  const result =findById(request.params.id, animals);
  if (result) {
    response.json(result);
  } else {
    //The 404 status code is meant to communicate to the client that the
    //requested resource could not be found
    response.send(404);
  }
});


app.post('/api/animals', (req, res) => {
  //req.body is where our incoming content will be
  //console.log(req.body);
  
  //Set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  //If any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {

    //The res.status().send(); is a response method to relay a message to
    //the client making the request. We send them an HTTP status code and a
    //message explaining what went wrong.
    res.status(400).send('The animal is not properly formatted.');
  } else {
    //Add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    //Converts response to JSON format
    res.json(req.body);
  }
});


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