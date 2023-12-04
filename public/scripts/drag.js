document.addEventListener('DOMContentLoaded', () => {
  const pokemons = document.querySelectorAll('.pokemon');
  const boxes = document.querySelectorAll('.pokemon-box');

  let draggedPokemon = null;

  pokemons.forEach(pokemon => {
    pokemon.addEventListener('dragstart', (e) => {
      draggedPokemon = e.target.closest('.pokemon');
      draggedPokemon.classList.add('dragging');
    });

    pokemon.addEventListener('dragend', () => {
      if (draggedPokemon) {
        draggedPokemon.classList.remove('dragging');
      }
      draggedPokemon = null;
    });
  });

  boxes.forEach(box => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    box.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedPokemon) {
        const location = box.dataset.location;
        box.appendChild(draggedPokemon);
        draggedPokemon.style.left = 'auto';
        draggedPokemon.style.top = 'auto';
        draggedPokemon.classList.remove('dragging');
        
        const pokemonId = draggedPokemon.dataset.pokemonid;
        const userID = draggedPokemon.dataset.userid;
        updatePokemonLocation(pokemonId, location, userID); // Function to send data to the server
        console.log(`Pokemon ID ${draggedPokemon.dataset.pokemonid} dropped in ${location}`);
      }
    });
  });
  function updatePokemonLocation(pokemonId, location, userID) {
    fetch('/updatePokemonLocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pokemonId, location, userID })
    })
    .then(response => {
      if (response.ok) {
        console.log(`Pokemon ID ${pokemonId} moved to location ${location}`);
      } else {
        console.error('Failed to update location');
      }
    })
    .catch(error => {
      console.error('Error updating location:', error);
    });
  }
});
