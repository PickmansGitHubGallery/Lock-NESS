var express = require('express');
var app = express();
// image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${...}`

async function CreatePokemonList() {
  try {
    const apiPokemonUrl1 = 'https://pokeapi.co/api/v2/pokedex/32/';
    const apiPokemonUrl2 = 'https://pokeapi.co/api/v2/pokedex/32/';
    const Data1 = await fetch(apiPokemonUrl1);
    const Data2 = await fetch(apiPokemonUrl2);
    const data1 = await Data1.json();
    const data2 = await Data2.json();

    const data = data1.pokemon_entries.concat(data2.pokemon_entries);
    // console.log(data);
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

async function updatePokemonAttributes() {
  try {
    const pokemonList = await CreatePokemonList();
    const updatedPokemonList = await Promise.all(
      pokemonList.map(async pokemon => {
        try {
          const pokemonDetails = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.Pokemonid}/`);
          const PokemonInfo = await pokemonDetails.json();
          const isUnbreedable = PokemonInfo.egg_groups.some(group => group.name === 'no-eggs');
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
    throw error;
  }
}

async function UpdateGmaxAndMega() {
  try {
    const pokemonList = await updatePokemonAttributes();
    const updatedPokemonList = [];

    await Promise.all(
      pokemonList.map(async (pokemon) => {
        try {
          const pokemonDetails = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.Pokemonid}/`);
          const PokemonInfo = await pokemonDetails.json();
          const varieties = PokemonInfo.varieties;

          const filteredVarieties = varieties.filter(variety =>
            variety.pokemon.name.endsWith('-gmax') || variety.pokemon.name.endsWith('-mega')
          );

          const updatedPokemonVarieties = filteredVarieties.map(variety => ({
            Pokemonid: variety.pokemon.url.split('/').filter(Boolean).pop(),
            Type: variety.pokemon.name,
            Basic: false,
            Breedable: false,
            Gmax: variety.pokemon.name.endsWith('-gmax'),
            Mega: variety.pokemon.name.endsWith('-mega')
          }));

          if (updatedPokemonVarieties.length === 0) {
            // If no Gmax/Mega varieties found, push the original Pokemon into the updated list
            updatedPokemonList.push(pokemon);
          } else {
            // If Gmax/Mega varieties found, push the updated varieties into the updated list
            updatedPokemonList.push(...updatedPokemonVarieties);
          }
        } catch (error) {
          console.error(`Error processing details for ${pokemon.Type}:`, error);
          // Push the original Pokemon into the updated list in case of an error
          updatedPokemonList.push(pokemon);
        }
      })
    );
    //console.log(updatedPokemonList);
    return updatedPokemonList;
  } catch (error) {
    console.error('Error updating Pokemon attributes:', error);
    throw error;
  }
}


module.exports = {
  updatePokemonAttributes: updatePokemonAttributes,
  UpdateGmaxAndMega: UpdateGmaxAndMega
};
