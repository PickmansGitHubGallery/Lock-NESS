var express = require('express');
var router = express.Router();
const db = require('../database/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  db.getAllBasicPokemons()
  .then((pokemons) => {
    console.log(pokemons)
  });
  
  res.render('index', { title: 'Express' });

});

module.exports = router;
