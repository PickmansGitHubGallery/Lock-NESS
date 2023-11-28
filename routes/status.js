const express = require('express');
const router = express.Router();

// Sample data for demonstration purposes
const pokemonList = [
  { id: 1, name: 'Pikachu', location: 1 },
  { id: 2, name: 'Bulbasaur', location: 2 },
  { id: 3, name: 'Charmander', location: 3 },
  // Add more Pokemon data
];

router.get('/', (req, res) => {
  const pokemonByLocation1 = pokemonList.filter(pokemon => pokemon.location === 1);
  const pokemonByLocation2 = pokemonList.filter(pokemon => pokemon.location === 2);
  const pokemonByLocation3 = pokemonList.filter(pokemon => pokemon.location === 3);

  res.render('status', { pokemonByLocation1, pokemonByLocation2, pokemonByLocation3 });
});

module.exports = router;
