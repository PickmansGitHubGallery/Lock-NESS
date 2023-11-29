var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
    Liste.generateRandomPokemons(50, 1, 1, 1, 1)
    .then((genereretPokemoner) => {
        const updatedPokemonList = genereretPokemoner.map((pokemon) => {
            return { ...pokemon, location: Math.floor(Math.random() * 3) + 1 };
        });
        const boxPokemons = updatedPokemonList.filter(pokemon => pokemon.location === 1);
        const teamPokemons = updatedPokemonList.filter(pokemon => pokemon.location === 2);
        const graveyardPokemons = updatedPokemonList.filter(pokemon => pokemon.location === 3);

        res.render('myteam', { title: 'My Team', boxPokemons, teamPokemons,graveyardPokemons });
    })
    .catch((err) => {
        console.log(err);
    });  
  });

module.exports = router;