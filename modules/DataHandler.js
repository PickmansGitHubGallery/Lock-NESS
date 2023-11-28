var express = require('express');
var app = express();
//image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${


async function CreatePokemonList() {
    try {
      const apiPokemonUrl1 = 'https://pokeapi.co/api/v2/pokedex/32/';
      const apiPokemonUrl2 = 'https://pokeapi.co/api/v2/pokedex/32/';
      const Data1 = await fetch(apiPokemonUrl1);
      const Data2 = await fetch(apiPokemonUrl2);
      const data1 = await Data1.json();
      const data2 = await Data2.json();
  
      const data = data1.pokemon_entries.concat(data2.pokemon_entries);
      //console.log(data);
      // res.json(data);
  
      const pokemonList = data.map((pokemon) => ({
        Type: pokemon.pokemon_species.name,
        Pokemonid: pokemon.pokemon_species.url.split('/').filter(Boolean).pop(),
      }));
    
       // Making sure there's no double entries of a single pokemon 
    const uniqueSet = new Set(pokemonList.map(pokemon => JSON.stringify(pokemon)));
    const UniquePokemonList = Array.from(uniqueSet).map(pokemonString => JSON.parse(pokemonString));
    
    return UniquePokemonList;
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      throw error; // Rethrow the error to be caught by the caller or handle it appropriately
    }
  }
  async function updatePokemonAttributes()
  {
    try{
      const pokemonList = await CreatePokemonList();
      const updatedPokemonList = await Promise.all(
      //for hver pokemon
      pokemonList.map(async pokemon => {
        try {
          //Hent siden
          const pokemonDetails = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.Pokemonid}/`);
          //converter fra json til object
          const PokemonInfo = await pokemonDetails.json();
          //tjek om den er med i no-eggs gruppen. sætter unbreedable til false som std og true hvis den er i no-eggs
          const isUnbreedable = PokemonInfo.egg_groups.some(group => group.name === 'no-eggs');
          //sætter isBasic true hvis evolves_from_spieces er null
          const isBasic = PokemonInfo.evolves_from_species === null;
          
          const isBreedable = !isUnbreedable;
        
          return {
            ...pokemon,
            Breedable: isBreedable,
            Basic: isBasic
          };
        } catch (error) {
          console.error(`Error processing details for ${pokemon.name}:`, error);
          return pokemon;
        }
      })
    );
    return updatedPokemonList; 
  } catch (error) {
    console.error('Error updating Pokemon attributes:', error);
    throw error; // Rethrow the error to be caught by the caller or handle it appropriately
  }
  }
  module.exports = {
    updatePokemonAttributes: updatePokemonAttributes
  };