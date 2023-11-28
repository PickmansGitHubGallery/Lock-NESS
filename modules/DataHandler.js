var express = require('express');
var app = express();
// image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${...}`

async function CreatePokemonList() {
  try {
    const apiPokemonUrl1 = 'https://pokeapi.co/api/v2/pokedex/31/';
    const apiPokemonUrl2 = 'https://pokeapi.co/api/v2/pokedex/32/';
    const Data1 = await fetch(apiPokemonUrl1);
    const Data2 = await fetch(apiPokemonUrl2);
    const data1 = await Data1.json();
    const data2 = await Data2.json();

    const data = [...data1.pokemon_entries, ...data2.pokemon_entries];

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
            Basic: isBasic,
            Gmax: false,
            Mega: false,
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
          const pokemonDetails = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.Pokemonid}/`);
          const PokemonInfo = await pokemonDetails.json();
          
          const varieties = PokemonInfo.varieties;

          const gmaxVarieties = varieties.find(variety =>
            variety.pokemon.name.endsWith('-gmax')
          );
          const megaVarieties = varieties.find(variety =>
            variety.pokemon.name.endsWith('-mega')
          );

          if (gmaxVarieties || megaVarieties) {
            if (gmaxVarieties) {
              updatedPokemonList.push({
                Pokemonid: gmaxVarieties.pokemon.url.split('/').filter(Boolean).pop(),
                Type: gmaxVarieties.pokemon.name,
                Basic: false,
                Breedable: false,
                Gmax: true,
                Mega: false
              });
            }
            if (megaVarieties) {
              updatedPokemonList.push({
                Pokemonid: megaVarieties.pokemon.url.split('/').filter(Boolean).pop(),
                Type: megaVarieties.pokemon.name,
                Basic: false,
                Breedable: false,
                Gmax: false,
                Mega: true
              });
            }
          }
        } catch (error) {
          console.error(`Error processing details for ${pokemon.Type}:`, error);
        }
      })
    );

    const appendedList = [...updatedPokemonList, ...pokemonList];
    return appendedList;
  } catch (error) {
    console.error('Error updating Pokemon attributes:', error);
    throw error;
  }

}





module.exports = {
  updatePokemonAttributes: updatePokemonAttributes,
  UpdateGmaxAndMega: UpdateGmaxAndMega
};

    
