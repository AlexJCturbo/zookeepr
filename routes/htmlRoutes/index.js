const path = require('path');
const router = require('express').Router();

//Getting index.html to be served from our Express.js server
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//The endpoint here is just /animals
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

//This route will take us to /zookepers
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

//Wildcard Routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;