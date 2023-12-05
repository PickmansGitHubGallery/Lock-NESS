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

  if (token) {
    try {
      const userData = await db.getUserByToken(token);

      if (userData) {
        const { pokemonSearch, location } = req.body;
        const userID = userData.Userid;

        // Hent detaljer om den valgte Pokémon
        const selectedPokemonDetails = getPokemonDetailsFromList(Liste.pokemonList, pokemonSearch);

        if (!selectedPokemonDetails) {
          res.status(400).send('Invalid Pokémon selection');
          return;
        }

        // Indsæt Pokémon i team og opdater dens placering i databasen
        await db.insertPokemonIntoTeam(selectedPokemonDetails.Pokemonid, location, userID);

        res.status(200).send('Pokémon added successfully');
      } else {
        res.status(401).send('User not found');
      }
    } catch (err) {
      console.error('Error handling Pokémon selection:', err);
      res.status(500).send('Failed to handle Pokémon selection');
    }
  } else {
    res.status(401).send('Token not found');
  }
});

module.exports = router;
