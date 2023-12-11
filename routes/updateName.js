var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const nickNameModule = require('../Utilities/nickName.js');


router.post('/', function(req, res, next) {
    let token = req.cookies.token;
    if (token) {
      db.getUserByToken(token)
        .then((userData) => {
          if (userData) {
            const userID = userData.Userid;
            const name = req.body.name;
            const pokemonId = req.body.pokemonId;
            const nicknameValidated = nickNameModule.validateNickName(name);
  
            if (nicknameValidated) {
              db.updateNickname(name, pokemonId, userID)
                .then(() => {
                  // Send a custom success status code
                  res.status(200).send('Nickname updated successfully');
                })
                .catch((err) => {
                  console.error('Error while updating pokemon name:', err);
                  res.status(500).send('Internal Server Error');
                });
            } else {
              res.status(400).send('Invalid nickname');
            }
          }
        })
        .catch((err) => {
          console.error('Error while fetching user data:', err);
          res.status(500).send('Internal Server Error');
        });
    } else {
      res.status(401).send('Unauthorized');
    }
  }); 

module.exports = router;