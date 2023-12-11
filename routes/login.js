var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const login = require('../database/login.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login' });
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
      loginError= "Wrong username or password";;
      res.render('login', { loginError: loginError });
    }
  } catch (err) {
    loginError= "Wrong username or password";
    res.render('login', { loginError: loginError });
  }
});

module.exports = router;