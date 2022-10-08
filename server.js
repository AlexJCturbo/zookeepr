//Require Express.js
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//The require() statements will read the index.js files in each of the directories indicated.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//available (like css and js files in this case)
app.use(express.static('public'));

//Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
/*
This is our way of telling the server that any time a client navigates to
<ourhost>/api, the app will use the router we set up in apiRoutes. If / is
the endpoint, then the router will serve back our HTML routes.
*/

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});