var express = require('express');
var router = express.Router();
const db = require('../database/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createUser', { title: 'Create User' });
  });
  
router.post('/', async function(req, res, next) {
  let email = req.body.Email;
  let brugernavn = req.body.Username;
  let password = req.body.Password;
  db.createUser(email, password, brugernavn)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      errorMessage = "Username already taken, try again"; 
      res.render('createUser', { title: 'Create User', errorMessage: errorMessage});
    });
});

  module.exports = router;
