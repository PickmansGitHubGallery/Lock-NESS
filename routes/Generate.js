var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');

pokemons = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Generate.pug', { title: 'Generate Pokemons',    pokemonList : pokemons });
});



/* POST home page. */
router.post('/', function(req, res, next) {
    let Mega = "";
    let Gmax = "";
    let breedable = "";
    let Basic = "";

    if (req.body.Mega == 'on') {
        Mega = 1;
    } else {
        Mega = 0;
    }

    if (req.body.Gmax == 'on') {
        Gmax = 1;
    } else {
        Gmax = 0;
    }

    if (req.body.Unbreedable == 'on') {
        breedable = 0;
    } else {
        breedable = 1;
    }

   if (req.body.Basic == 'on') {
        Basic = 0;
    } else {
        Basic = 1;
    }

        Liste.generateRandomPokemons( req.body.slider, Gmax, Mega, breedable, Basic)
        .then((genereretPokemoner) => {
        res.render('Generate', { title: 'Generate Pokemons', pokemonList: genereretPokemoner });
        });
       
    });

module.exports = router;
