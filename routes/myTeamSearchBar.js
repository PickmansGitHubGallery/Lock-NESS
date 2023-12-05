var express = require('express');
var router = express.Router();
const db = require('../database/db.js');

router.post('/', function(req, res) {
  let token = req.cookies.token;
  if (token) {
    db.getUserByToken(token)
      .then((userData) => {
        if (userData) {
          const { pokemonId, location, nickname } = req.body;

          // Assuming location can be either 'box', 'team', or 'graveyard'
          let locationNumber;
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

          // Insert the searched Pokémon into the team
          db.insertSearchedPokemon(pokemonId, nickname, locationNumber, userData.Userid)
            .then(() => {
              res.status(200).send('Searched Pokémon inserted into the team successfully');
            })
            .catch((err) => {
              console.error('Error inserting searched Pokémon:', err);
              res.status(500).send('Failed to insert searched Pokémon into the team');
            });

        } else {
          res.status(401).send('User not found');
        }
      })
      .catch((err) => {
        console.error('Error retrieving user data:', err);
        res.status(500).send('Failed to retrieve user data');
      });
  } else {
    res.status(401).send('Token not found');
  }
});

module.exports = router;
