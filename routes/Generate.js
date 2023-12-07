var express = require('express');
var router = express.Router();
const db = require('../database/db.js');
const Liste = require('../Utilities/generatePokemonList.js');

pokemons = [];


router.get('/', function(req, res, next) {
    res.render('Generate.pug', { title: 'Generate Pokemons', pokemonList : pokemons, Mega: false, Gmax: false, Unbreedable: false, Basic: false, slider: 1, sliderInput: 1, sliderMax: 218 });
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
            res.render('Generate', { title: 'Generate Pokemons', pokemonList: genereretPokemoner, Mega: !!CheckMega, Gmax: !!CheckGmax, Unbreedable: !!CheckUnbreedable, Basic: !!CheckBasic,  slider: parseInt(slider), sliderInput: parseInt(sliderInput), sliderMax: sliderMax});
        });
       
    });

module.exports = router;
