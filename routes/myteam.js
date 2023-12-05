var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  let token = req.cookies.token;
    if (token) {
      db.getUserByToken(token)
        .then((userData) => {
          if (userData) {
            db.getMyTeam(userData)
              .then((myTeam) => {
                db.getAllPokemons().then((pokemonList) => {
                  console.log(pokemonList);
                const boxPokemons = myTeam.filter(pokemon => pokemon.Location === 1);
                const teamPokemons = myTeam.filter(pokemon => pokemon.Location === 2);
                const graveyardPokemons = myTeam.filter(pokemon => pokemon.Location === 3);
                res.render('myteam', { title: 'My Team', boxPokemons, teamPokemons, graveyardPokemons,pokemonList});
              })
            })
              .catch((err) => {
                console.error('Error while fetching team data:', err);
                res.status(500).send('Internal Server Error');
              });
          } else {
            res.redirect('/login');
          }
        })
        .catch((err) => {
          console.error('Error while authenticating token:', err);
          res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
  }); 
 /*
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
*/


router.post('/', function(req, res) {
  let token = req.cookies.token;
  if (token) {
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
