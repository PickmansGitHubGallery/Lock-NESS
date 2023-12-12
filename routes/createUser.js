var express = require('express');
var router = express.Router();
const db = require('../database/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  const loggedIn = req.cookies.token ? true : false;
  res.render('createUser', { title: 'Create User', loggedIn: loggedIn });
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
      const loggedIn = req.cookies.token ? true : false;
      errorMessage = "Username already taken, try again"; 
      res.render('createUser', { title: 'Create User', errorMessage: errorMessage, loggedIn: loggedIn });
    });
});

module.exports = router;