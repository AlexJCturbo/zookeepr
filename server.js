//Require Express.js
const express = require('express');

const fs = require('fs');

/*
The path module built into the Node.js API that provides utilities for
working with file and directory paths. It ultimately makes working with
our file system a little more predictable, especially when we work with
production environments such as Heroku.
*/
const path = require('path');

//Requiring the data
const { animals } = require('./data/animals.json');

/*
When Heroku runs our app, it sets an environment variable called
process.env.PORT. We're going to tell our app to use that port, if it
has been set, and if not, default to port 3001.
*/
const PORT = process.env.PORT || 3001;

/*
Instantiate the server
We assign express() to the app variable so that we can later chain on
methods to the Express.js server
*/
const app = express();

/*
The app.use() is a method executed by our Express.js server that mounts
a function to the server that our requests will pass through before
getting to the intended endpoint. The functions we can mount to our
server are referred to as middleware.

We needed to parse (or convert) the response data to JSON format before
we could interface with it.
*/
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//Set up Express.js middleware that instructs the server to make certain files readily
//available
app.use(express.static('public'));
/*
The way it works is that we provide a file path to a location in our application (in
this case, the public folder) and instruct the server to make these files static
resources. This means that all of our front-end code can now be accessed without
having a specific server endpoint created for it!
*/

/*
Middleware functions can serve many different purposes. Ultimately they
allow us to keep our route endpoint callback functions more readable
while letting us reuse functionality across routes to keep our code DRY.

express.urlencoded({extended: true}) method is a method built into
Express.js. It takes incoming POST data and converts it to key/value
pairings that can be accessed in the req.body object. The extended:
true option set inside the method call informs our server that there
may be sub-array data nested in it as well, so it needs to look as deep
into the POST data as possible to parse all of the data correctly.

The express.json() method we used takes incoming POST data in the form
of JSON and parses it into the req.body JavaScript object. Both of the
above middleware functions need to be set up every time you create a
server that's looking to accept POST data.
*/

/*
To create this query, we'll add another function called filterByQuery().
This is going to help us handle different kinds of queries. We will start
by extracting the data from after the question mark. This time we will
use the req parameter, which short for "request."
*/

function filterByQuery(query, animalsArray) {
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    let personalityTraitsArray = [];

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}

/*
How does this process differ when querying for one versus multiple
personality traits? Adding &personalityTraits=quirky&personalityTraits=rash
to the end of the URL in the browser will cause req.query.personalityTraits
to become the following array: ['quirky', 'rash']. However, if we were
to query by only one personality trait, like personalityTraits=rash, then
req.query.personalityTraits would be the string rash.
*/

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}


/*
Here, we just created a function that accepts the POST route's req.body
value and the array we want to add the data to. In this case, that array
will be the animalsArray, because the function is for adding a new animal
to the catalog.
*/
function createNewAnimal (body, animalsArray) {
  console.log(body);

  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    //We want to write to our animals.json file in the data subdirectory, so
    //we use the method path.join() to join the value of __dirname, which
    //represents the directory of the file we execute the code in, with the
    //path to the animals.json file.
    path.join(__dirname, './data/animals.json'),

    //We need to save the JavaScript array data as JSON, so we use JSON.stringify()
    //to convert it. The other two arguments used in the method, null and 2,
    //are means of keeping our data formatted. The null argument means we
    //don't want to edit any of our existing data; if we did, we could pass
    //something in there. The 2 indicates we want to create white space
    //between our values to make it more readable. If we were to leave those
    //two arguments out, the entire animals.json file would work, but it
    //would be really hard to read.
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  // return finished code to post route for response
  return animal;
}

//Function to validate the data from body
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

/*
GET requests
The get() method requires two arguments. The first is a string that
describes the route the client will have to fetch from. The second is a
callback function that will execute every time that route is accessed
with a GET request.

We are using the send() method from the res parameter (short for
response) to send the string Hello! to our client.
*/
app.get('/api/animals', (req, res) => {
  //res.send('Hello');
  //res.json(animals);
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  console.log(req.query);
  res.json(results);
});

/*
The req object gives us access to the req.params property. Sometimes, we
only want one specific animal, rather than an array of all the animals
that match a query and for that purpose we user the req.params object.
Unlike the query object, the params object needs to be defined in the
route path, with <route>/:<parameterName>.
*/
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

//http://localhost:3001/api/animals?name=Erica&&name=Spindle&&species=bear&diet=omnivore

/*
We just need to use one method to make our server listen. We're going
to chain the listen() method onto our server to do it.

If you're browsing the internet, chances are you're visiting the address
on one of two ports: 80 or 443. 80 is typically used for sites that
begin with http://, and 443 is used for sites that begin with https://.
This raises the question: Why are we using 3001 instead of 80 or 443?

The truth is, there's nothing wrong with running your server on 80 or 443.
However, ports with numbers 1024 and under are considered special by the
operating system, and often require special permissions (like running the
process as an administrator). To avoid these permission restrictions, we
chose to run on a port that is less restricted. In this instance, we chose
3001, but there are plenty of other ports to choose from. In fact, port
numbers can range from 1024 to 49151! We chose a number around 3000 because
it is common practice and fairly easy to remember.
*/

/*
POST requests
Notice the route name, /api/animals. Aren't we already using that for a
GET request? How does it know which route to use when a request is made?
It'll know because of how we form the request.

We're going to have to instruct Express.js on how to handle incoming data
and set something up known as middleware.

In order for our server to accept incoming data the way we need it to,
we need to tell our Express.js app to intercept our POST request before
it gets to the callback function. At that point, the data will be run
through a couple of functions to take the raw data transferred over
HTTP and convert it to a JSON object.
*/

/*
Keep in mind that whenever we use require() to import data or functionality,
it's only reading the data and creating a copy of it to use in server.js
*/
app.post('/api/animals', (req, res) => {
  //req.body is where our incoming content will be
  //console.log(req.body);
  
  //Set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  /*
  In our POST route's callback before we create the data and add it to the
  catalog, we'll pass our data through this validation function. In this case,
  the animal parameter is going to be the content from req.body, and we're
  going to run its properties through a series of validation checks. If any
  of them are false, we will return false and not create the animal data.
  */
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


/*
We can assume that a route that has the term api in it will deal in transference of
JSON data, whereas a more normal-looking endpoint such as /animals should serve an
HTML page.
*/
//This route will take us to /animals
//The endpoint here is just /animals
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});
/*
So far we've only used routes that have actual names like /api/animals, so where does
the / route points us to? It brings us to the root route of the server! This is the
route used to create a homepage for a server.
*/


//This route will take us to /zookepers
app.get('/zookepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookepers.html'));
});


//Wildcard Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
/*
The order of your routes matters! The * route should always come last. Otherwise, it
will take precedence over named routes.
*/

//Getting index.html to be served from our Express.js server
app.get('/', function (req, res) {
  //this GET route has just one job to do, and that is to respond with an HTML page
  //to display in the browser. So instead of using res.json(), we're using
  //res.sendFile() by telling where to find the file we want our server to read.
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});