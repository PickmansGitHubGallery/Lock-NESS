const db = require('../database/db.js');



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPokemons(number, Gmax, Mega, Breedable, Basic){
  filterPokemons(Gmax, Mega, Breedable, Basic)
.then((filteredPokemons) => {
  
  let genereretPokemoner = [];
  let randomNumberList = [];
  for(let i = 0; i< number; i++){
    let randomNumber = getRandomInt(1, filteredPokemons.length);
    if(randomNumberList.includes(randomNumber)){
      i--;
      console.log(i + 'if statement');
    }
    else{ 
    randomNumberList.push(randomNumber);
    genereretPokemoner.push(filteredPokemons[randomNumber]);
    console.log(i + 'else statement');
    }

  }

  return genereretPokemoner;
})
}

function filterPokemons(Gmax, Mega, Breedable, Basic) {
  return new Promise((resolve, reject) => {
    db.getAllPokemons()
      .then((pokemons) => {
        let filteredPokemons = [];

        pokemons.forEach((pokemon) => {
          if (pokemon.Basic == 1 && pokemon.Breedable == 1) {
            filteredPokemons.push(pokemon);
          } else if (Mega == 1 && pokemon.Mega == 1) {
            filteredPokemons.push(pokemon);
          } else if (Gmax == 1 && pokemon.Gmax == 1) {
            filteredPokemons.push(pokemon);
          } else if (
            Breedable == 0 &&
            pokemon.Breedable == 0 &&
            pokemon.Gmax == 0 &&
            pokemon.Mega == 0
          ) {
            filteredPokemons.push(pokemon);
          } else if (
            Basic == 0 &&
            pokemon.Basic == 0 &&
            pokemon.Gmax == 0 &&
            pokemon.Mega == 0
          ) {
            filteredPokemons.push(pokemon);
          }
        });
        resolve(filteredPokemons);
      })
      .catch((error) => {
        console.error('Error getting Pokémon data:', error);
        reject(error);
      });
  });
}

module.exports = {
  generateRandomPokemons,
  filterPokemons
}