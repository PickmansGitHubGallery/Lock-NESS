var express = require('express');c
var router = express.Router();
const db = require('../database/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createUser', { title: 'Create User' });
  });
  
  router.post('/', async function(req, res, next) {
    let email = req.body.email;
    let brugernavn = req.body.brugernavn;
    let password = req.body.password;
    db.createUser(email, password, brugernavn)
    .then(() => {
        //set cookie
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/createUser');
    })

  });