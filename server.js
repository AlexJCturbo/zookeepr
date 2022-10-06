//Require Express.js
const express = require('express');

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

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});