var express = require('express');
const fetch = require('node-fetch');
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
        Name: pokemon.pokemon_species.name,
        ID: pokemon.pokemon_species.url.split('/').filter(Boolean).pop(),
      }));
    
       // Making sure there's no double entries of a single pokemon 
    const uniqueSet = new Set(pokemonList.map(pokemon => JSON.stringify(pokemon)));
    const UniquePokemonList = Array.from(uniqueSet).map(pokemonString => JSON.parse(pokemonString));
      console.log(pokemonList);
      return UniquePokemonList;
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      throw error; // Rethrow the error to be caught by the caller or handle it appropriately
    }
  }
  
  module.exports = app;