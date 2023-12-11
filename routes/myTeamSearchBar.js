var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');

// Tilføj denne funktion til at hente detaljer om en Pokémon fra listen
function getPokemonDetailsFromList(pokemonList, pokemonType) {
  return pokemonList.find(pokemon => pokemon.Type === pokemonType);
}

router.post('/', async function(req, res) {
  let token = req.cookies.token;
  let pokemonID = req.body.pokemonId;
  let location = req.body.location;
  let locationNumber = 0;
  
  if (location == 'box') {
    locationNumber = 1;
  } else if (location == 'team') {
    locationNumber = 2;
  } else if (location == 'graveyard') {
    locationNumber = 3;
  } else {
    // Handle other cases or invalid locations
    res.status(400).send('Invalid location');
    return;
  }
  
  if (token) {
    db.getUserByToken(token)
      .then(userData => {
        if (!userData) {
          res.status(401).send('User not found');
        } else {
          const userID = userData.Userid;
          return db.insertPokemonIntoTeam(pokemonID, locationNumber, userID);
        }
      })
      .then(() => {
        res.status(200).send('Pokemon successfully inserted into team');
      })
      .catch(err => {
          res.status(409).send('Pokemon already exists in the selected location');
      });
  } else {
    res.status(401).send('Token not found');
  }
});
  
  

module.exports = router;
