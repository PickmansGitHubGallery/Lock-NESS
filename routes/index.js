var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const pokemonListe = require('../Utilities/generatePokemonList.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  pokemonListe.filterPokemons(0,0,1,1);
  res.render('index', { title: 'Express' });
});



module.exports = router;
