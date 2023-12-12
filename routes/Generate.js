var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');

pokemons = [];





router.get('/', function(req, res, next) {
  let token = req.cookies.token;
  const loggedIn = token ? true : false;
  if (token) {
    db.getUserByToken(token)
      .then((userData) => {
        if (userData) {
          console.log("Token is present and corresponds to a valid user");
          res.render('Generate.pug', { title: 'Generate Pokemons', pokemonList: pokemons, Mega: false, Gmax: false, Unbreedable: false, Basic: false, slider: 1, sliderInput: 1, sliderMax: 218, loggedIn: loggedIn });
        } else {
          // Token is present but doesn't correspond to a valid user'
          res.redirect('/login');
        }
      })
      .catch((err) => {
        console.error('Error while authenticating token:', err);
        res.redirect('/login');
      });
  } else {
    // No token is present
    res.redirect('/login');
  }
});
  
  /* GET myteam page. */
router.get('/myTeam', function(req, res, next) {
  // Handle the redirection logic here
  console.log('Redirecting to myteam');
  res.redirect('myteam');
});

router.post('/', function(req, res, next) {

    const CheckMega= req.body.Mega;
    const CheckGmax= req.body.Gmax;
    const CheckUnbreedable= req.body.Unbreedable;
    const CheckBasic= req.body.Basic;
    const slider = req.body.slider;
    const sliderInput = req.body.sliderInput;
    const sliderMax = req.body.sMax;

    let Mega = "";
    let Gmax = "";
    let breedable = "";
    let Basic = "";

    if (req.body.Mega == 'on') {
        Mega = 1;
    } else {
        Mega = 0;
    }

    if (req.body.Gmax == 'on') {
        Gmax = 1;
    } else {
        Gmax = 0;
    }

    if (req.body.Unbreedable == 'on') {
        breedable = 0;
    } else {
        breedable = 1;
    }

   if (req.body.Basic == 'on') {
        Basic = 0;
    } else {
        Basic = 1;
    }

    Liste.generateRandomPokemons( req.body.slider, Gmax, Mega, breedable, Basic)
    .then((genereretPokemoner) => {
      const loggedIn = req.cookies.token ? true : false;
      res.render('Generate', { title: 'Generate Pokemons', pokemonList: genereretPokemoner, Mega: !!CheckMega, Gmax: !!CheckGmax, Unbreedable: !!CheckUnbreedable, Basic: !!CheckBasic,  slider: parseInt(slider), sliderInput: parseInt(sliderInput), sliderMax: sliderMax, loggedIn: loggedIn });
    });
});



module.exports = router;