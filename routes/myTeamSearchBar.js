var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');


router.post('/', function(req, res) {
    let token = req.cookies.token;
    if (token) {
      console.log(req.body.selectedPokemon);
      db.getUserByToken(token)
        .then((userData) => {
          if (userData) {
            const { pokemonId, location } = req.body;
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
            const userID = userData.Userid;
            db.updatePokemonLocation(pokemonId, locationNumber, userID)
              .then(() => {
                res.status(200).send('Location updated successfully');
              })
              .catch((err) => {
                console.error('Error updating location:', err);
                res.status(500).send('Failed to update location');
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