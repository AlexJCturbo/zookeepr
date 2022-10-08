const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);

module.exports = router;

/*
Employing Router, having it use the module exported from animalRoutes.js
Doing it this way, we're using apiRoutes/index.js as a central hub for
all routing functions we may want to add to the application.
*/