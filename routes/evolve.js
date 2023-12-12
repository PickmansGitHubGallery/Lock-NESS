var express = require('express');
var router = express.Router();
const db = require('../database/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  const pokemonId = req.query.id;
  db.getEvolutions(pokemonId)
    .then((evolutions) => {
      console.log(evolutions);
      res.json(evolutions);
    })
    .catch((error) => {
    res.status(500).json({ error: 'Failed to fetch Pokemon names' });
  });
});

module.exports = router;