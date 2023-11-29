var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const pokemonListe = require('../Utilities/generatePokemonList.js');

const pokemonList = [
  { id: 1, name: 'Pikachu', location: 1 },
  { id: 2, name: 'Bulbasaur', location: 2 },
  { id: 3, name: 'Charmander', location: 3 },
  { id: 4, name: 'Squirtle', location: 4 },
  { id: 5, name: 'Jigglypuff', location: 5 },
  { id: 6, name: 'Meowth', location: 6 },
  { id: 7, name: 'Psyduck', location: 7 },
  { id: 8, name: 'Geodude', location: 8 },
  { id: 9, name: 'Magikarp', location: 9 },
  { id: 10, name: 'Eevee', location: 10 },
  { id: 11, name: 'Snorlax', location: 11 },
  { id: 12, name: 'Articuno', location: 12 },
  { id: 13, name: 'Zapdos', location: 13 },
  { id: 14, name: 'Moltres', location: 14 },
  { id: 15, name: 'Dragonite', location: 15 },
  { id: 16, name: 'Mewtwo', location: 16 },
  { id: 17, name: 'Mew', location: 17 },
  { id: 18, name: 'Chikorita', location: 18 },
  { id: 19, name: 'Cyndaquil', location: 19 },
  { id: 20, name: 'Totodile', location: 20 },
  { id: 21, name: 'Lugia', location: 21 },
  { id: 22, name: 'Ho-Oh', location: 22 },
  { id: 23, name: 'Treecko', location: 23 },
  { id: 24, name: 'Torchic', location: 24 },
  { id: 25, name: 'Mudkip', location: 25 },
  { id: 26, name: 'Rayquaza', location: 26 },
  { id: 27, name: 'Groudon', location: 27 },
  { id: 28, name: 'Kyogre', location: 28 },
  { id: 29, name: 'Deoxys', location: 29 },
  { id: 30, name: 'Lucario', location: 30 },{ id: 1, name: 'Pikachu', location: 1 },
  { id: 2, name: 'Bulbasaur', location: 2 },
  { id: 3, name: 'Charmander', location: 3 },
  { id: 4, name: 'Squirtle', location: 4 },
  { id: 5, name: 'Jigglypuff', location: 5 },
  { id: 6, name: 'Meowth', location: 6 },
  { id: 7, name: 'Psyduck', location: 7 },
  { id: 8, name: 'Geodude', location: 8 },
  { id: 9, name: 'Magikarp', location: 9 },
  { id: 10, name: 'Eevee', location: 10 },
  { id: 11, name: 'Snorlax', location: 11 },
  { id: 12, name: 'Articuno', location: 12 },
  { id: 13, name: 'Zapdos', location: 13 },
  { id: 14, name: 'Moltres', location: 14 },
  { id: 15, name: 'Dragonite', location: 15 },
  { id: 16, name: 'Mewtwo', location: 16 },
  { id: 17, name: 'Mew', location: 17 },
  { id: 18, name: 'Chikorita', location: 18 },
  { id: 19, name: 'Cyndaquil', location: 19 },
  { id: 20, name: 'Totodile', location: 20 },
  { id: 21, name: 'Lugia', location: 21 },
  { id: 22, name: 'Ho-Oh', location: 22 },
  { id: 23, name: 'Treecko', location: 23 },
  { id: 24, name: 'Torchic', location: 24 },
  { id: 25, name: 'Mudkip', location: 25 },
  { id: 26, name: 'Rayquaza', location: 26 },
  { id: 27, name: 'Groudon', location: 27 },
  { id: 28, name: 'Kyogre', location: 28 },
  { id: 29, name: 'Deoxys', location: 29 },
  { id: 30, name: 'Lucario', location: 30 },{ id: 1, name: 'Pikachu', location: 1 },
  { id: 2, name: 'Bulbasaur', location: 2 },
  { id: 3, name: 'Charmander', location: 3 },
  { id: 4, name: 'Squirtle', location: 4 },
  { id: 5, name: 'Jigglypuff', location: 5 },
  { id: 6, name: 'Meowth', location: 6 },
  { id: 7, name: 'Psyduck', location: 7 },
  { id: 8, name: 'Geodude', location: 8 },
  { id: 9, name: 'Magikarp', location: 9 },
  { id: 10, name: 'Eevee', location: 10 },
  { id: 11, name: 'Snorlax', location: 11 },
  { id: 12, name: 'Articuno', location: 12 },
  { id: 13, name: 'Zapdos', location: 13 },
  { id: 14, name: 'Moltres', location: 14 },
  { id: 15, name: 'Dragonite', location: 15 },
  { id: 16, name: 'Mewtwo', location: 16 },
  { id: 17, name: 'Mew', location: 17 },
  { id: 18, name: 'Chikorita', location: 18 },
  { id: 19, name: 'Cyndaquil', location: 19 },
  { id: 20, name: 'Totodile', location: 20 },
  { id: 21, name: 'Lugia', location: 21 },
  { id: 22, name: 'Ho-Oh', location: 22 },
  { id: 23, name: 'Treecko', location: 23 },
  { id: 24, name: 'Torchic', location: 24 },
  { id: 25, name: 'Mudkip', location: 25 },
  { id: 26, name: 'Rayquaza', location: 26 },
  { id: 27, name: 'Groudon', location: 27 },
  { id: 28, name: 'Kyogre', location: 28 },
  { id: 29, name: 'Deoxys', location: 29 },
  { id: 30, name: 'Lucario', location: 30 },{ id: 1, name: 'Pikachu', location: 1 },
  { id: 2, name: 'Bulbasaur', location: 2 },
  { id: 3, name: 'Charmander', location: 3 },
  { id: 4, name: 'Squirtle', location: 4 },
  { id: 5, name: 'Jigglypuff', location: 5 },
  { id: 6, name: 'Meowth', location: 6 },
  { id: 7, name: 'Psyduck', location: 7 },
  { id: 8, name: 'Geodude', location: 8 },
  { id: 9, name: 'Magikarp', location: 9 },
  { id: 10, name: 'Eevee', location: 10 },
  { id: 11, name: 'Snorlax', location: 11 },
  { id: 12, name: 'Articuno', location: 12 },
  { id: 13, name: 'Zapdos', location: 13 },
  { id: 14, name: 'Moltres', location: 14 },
  { id: 15, name: 'Dragonite', location: 15 },
  { id: 16, name: 'Mewtwo', location: 16 },
  { id: 17, name: 'Mew', location: 17 },
  { id: 18, name: 'Chikorita', location: 18 },
  { id: 19, name: 'Cyndaquil', location: 19 },
  { id: 20, name: 'Totodile', location: 20 },
  { id: 21, name: 'Lugia', location: 21 },
  { id: 22, name: 'Ho-Oh', location: 22 },
  { id: 23, name: 'Treecko', location: 23 },
  { id: 24, name: 'Torchic', location: 24 },
  { id: 25, name: 'Mudkip', location: 25 },
  { id: 26, name: 'Rayquaza', location: 26 },
  { id: 27, name: 'Groudon', location: 27 },
  { id: 28, name: 'Kyogre', location: 28 },
  { id: 29, name: 'Deoxys', location: 29 },
  { id: 30, name: 'Lucario', location: 30 },
  
  // Add more Pokemon data as needed
];


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Generate.pug', { title: 'Generate Pokemons', pokemonList: pokemonList });
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

    console.log(Gmax, Mega, breedable, Basic, req.body.slider);

    //pokemonListe.generateRandomPokemons(Gmax, Mega, Unbreedable, Basic, req.body.slider);
        /* .then((result) => {
            res.render('Generate.pug', { title: 'Generate Pokemons', pokemons: result });
        }).catch((err) => {
            console.log(err);
            res.render('Generate.pug', { title: 'Generate Pokemons' });
        });*/
});

module.exports = router;
