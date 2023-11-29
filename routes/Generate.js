var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const pokemonListe = require('../Utilities/generatePokemonList.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Generate.pug', { title: 'Generate Pokemons' });

});

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body); 
  let Mega = req.body.Mega || null;
  let Gmax = req.body.Gmax || null;
  let breedable = !req.body.Unbreedable || null;
  let Evolved = req.body.Evolved || null;

  console.log(Gmax,Mega,Unbreedable,Evolved,req.body.slider);
  pokemonListe.generateRandomPokemons(Gmax,Mega,Unbreedable,Evolved,req.body.slider)
  .then((result) => {
    res.render('Generate.pug', { title: 'Generate Pokemons', pokemons: result });
  }).catch((err) => {
    console.log(err);
    res.render('Generate.pug', { title: 'Generate Pokemons' });
  })

});




module.exports = router;

