var express = require('express');
var router = express.Router();
const db = require('../database/db.js');


router.post('/', function(req, res, next) {
  const originalPokemonID = req.body.originalPokemonID;
  const pokemonID = req.body.PokemonId;
  let token = req.cookies.token;
  if (token) {
    db.getUserByToken(token)
      .then((userData) => {
        if (userData) {
          console.log(originalPokemonID, pokemonID, userData.Userid);
          db.updateEvolved(originalPokemonID, userData.Userid, pokemonID)
            .then(() => {
              res.status(200).send('Updated successfully'); // Sending a response after a successful update
            })
            .catch((updateErr) => { // Catching errors from updateEvolved
              console.error('Error while updating pokemon:', updateErr);
              res.status(500).send('Internal Server Error');
            });
        } else {
          res.status(404).send('User not found'); // Sending a response if user data is not found
        }
      })
      .catch((userErr) => { // Catching errors from getUserByToken
        console.error('Error while retrieving user data:', userErr);
        res.status(500).send('Internal Server Error');
      });
  } else {
    res.status(400).send('Token not provided'); // Sending a response if token is missing
  }
});

module.exports = router;