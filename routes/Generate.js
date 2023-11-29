var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const pokemonListe = require('../Utilities/generatePokemonList.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Generate.pug', { title: 'Generate Pokemons' });

});



module.exports = router;

