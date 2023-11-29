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
        // Update the location of the dropped Pokemon
        console.log(`Pokemon ID ${draggedPokemon.dataset.pokemonid} dropped in ${location}`);
      }
    });
  });

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', () => {
    // Logic to save the team and make a POST request with the updated Pokemon locations
    // You might use fetch or another method to send this data to your server
    console.log('Team saved!');
  });
});
