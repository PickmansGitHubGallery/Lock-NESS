document.addEventListener('DOMContentLoaded', () => {
  const pokemons = document.querySelectorAll('.pokemon');
  const boxes = document.querySelectorAll('.pokemon-box');
  const box = document.querySelector('#box');
  const team = document.querySelector('#team');
  const graveyard = document.querySelector('#graveyard');

  let draggedPokemon = null;

  pokemons.forEach(pokemon => {
    pokemon.addEventListener('dragstart', (e) => {
      // Check if the Pokemon is in the graveyard
      if (!pokemon.closest('#graveyard')) {
        draggedPokemon = e.target.closest('.pokemon');
        draggedPokemon.classList.add('dragging');
      } else {
        e.preventDefault(); // Prevent dragging out of the graveyard
      }
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
        
        updatePokemonLocation(pokemonId, location); // Function to send data to the server
        console.log(`Pokemon ID ${draggedPokemon.dataset.pokemonid} dropped in ${location}`);
      }
    });

    graveyard.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedPokemon) {
        // Show a confirmation box
        const isConfirmed = confirm('Are you sure you want to drop the Pokemon into the graveyard?');
        
        if (isConfirmed) {
          const location = graveyard.dataset.location;
          graveyard.appendChild(draggedPokemon);
          draggedPokemon.style.left = 'auto';
          draggedPokemon.style.top = 'auto';
          draggedPokemon.classList.remove('dragging');
  
          const pokemonId = draggedPokemon.dataset.pokemonid;
  
          updatePokemonLocation(pokemonId, location); // Function to send data to the server
          console.log(`Pokemon ID ${pokemonId} dropped in ${location}`);
        }
      }
    });

    team.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedPokemon) {
        const location = team.dataset.location;
        const li = team.querySelectorAll('.pokemon'); // Update selector to target the Pokemon elements
        const maxPokemon = 6;

        if (li.length >= maxPokemon) {
            console.log(li.length);
            alert("You can only have 6 pokemons in your team");
            return;
        } else {
        team.appendChild(draggedPokemon);
        draggedPokemon.style.left = 'auto';
        draggedPokemon.style.top = 'auto';
        draggedPokemon.classList.remove('dragging');
        
        const pokemonId = draggedPokemon.dataset.pokemonid;
        
        updatePokemonLocation(pokemonId, location); // Function to send data to the server
        console.log(`Pokemon ID ${draggedPokemon.dataset.pokemonid} dropped in ${location}`);
        }
      }
    });

  function updatePokemonLocation(pokemonId, location) {
    fetch('/myTeam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pokemonId, location})
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