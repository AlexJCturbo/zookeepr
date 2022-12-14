const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals.json');

//Route handler for GET request
router.get('/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  console.log(req.query);
  res.json(results);
});

router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    //The 404 status code means that the requested resource could not be found
    res.send(404);
  }
});

router.post('/animals', (req, res) => {
  //Set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  //If any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

module.exports = router;