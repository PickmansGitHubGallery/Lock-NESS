const db = require('../database/db.js');



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPokemons(number){
  db.getAllPokemons()
.then((pokemons) => {
  
  let genereretPokemoner = [];

  for(let i = 0; i< number; i++){
    let randomNumber = getRandomInt(1, 200);
    console.log(randomNumber);
    genereretPokemoner.push(pokemons[randomNumber]);

  }

  console.log(genereretPokemoner);
})
}

module.exports = {
  generateRandomPokemons
}