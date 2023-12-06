var express = require('express');
var router = express.Router();
const db = require('../database/db.js');

router.post('/', function(req, res, next) {
    const pokList = req.body.pokemonList;
    const parsedPokemonList = JSON.parse(pokList);
    let token = req.cookies.token;
    if (token) {
      db.getUserByToken(token)
        .then((userData) => {
          if (userData) {
            db.insertPokemonListIntoTeam(parsedPokemonList, userData.Userid, 1)
              .then(() => {
                res.status(200).send('Pokémon successfully inserted into team');
              })
              .catch((err) => {
                console.error('Error inserting Pokémon into team:', err);
                res.status(500).send('Failed to insert Pokémon into team');
              });
          } else {
            res.status(404).send('User not found');
          }
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          res.status(500).send('Failed to fetch user data');
        });
    } else {
      res.status(401).send('Unauthorized');
    }
  });
module.exports = router;