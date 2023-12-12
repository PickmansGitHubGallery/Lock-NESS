var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const login = require('../database/login.js');

router.get('/', function(req, res, next) {
  // Check if the user's authentication token is set
  const loggedIn = req.cookies.token ? true : false;
  res.render('login', { title: 'login', loggedIn: loggedIn });
});

router.post('/', async function(req, res, next) {
  try {
    let brugernavn = req.body.Username;
    let password = req.body.Password;
    const user = await db.authenticateUser(brugernavn, password);
    if (user) {
      const token = login.generateHashToken(brugernavn, login.getCurrentTimestamp());
      await db.setToken(token, brugernavn);
      res.cookie('token', token, { maxAge: 1800000, path: '/', domain: 'localhost' });
      res.redirect('/myTeam');
    } else {
      loginError= "Wrong username or password";
      res.render('login', { loginError: loginError, loggedIn: false });
    }
  } catch (err) {
    loginError= "Wrong username or password";
    res.render('login', { loginError: loginError, loggedIn: false });
  }
});

module.exports = router;