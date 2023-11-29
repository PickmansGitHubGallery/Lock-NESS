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
  let randomNumberList = [];
  for(let i = 0; i< number; i++){
    let randomNumber = getRandomInt(1, 534);
    if(randomNumberList.includes(randomNumber)){
      i--;
      console.log(i + 'if statement');
    }
    else{ 
    randomNumberList.push(randomNumber);
    genereretPokemoner.push(pokemons[randomNumber]);
    console.log(i + 'else statement');
    }

  }

  return genereretPokemoner;
})
}

module.exports = {
  generateRandomPokemons
}