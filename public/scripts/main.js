$(document).ready(function() {
  function enableDragAndDrop() {
    $('.pokemon').draggable({
      cursor: 'move',
      revert: 'invalid',
      start: function() {
        $(this).addClass('dragging');
      },
      stop: function() {
        $(this).removeClass('dragging');
      }
    });

    $('.section').droppable({
      accept: '.pokemon',
      drop: function(event, ui) {
        const $droppedPokemon = ui.draggable;
        const newLocation = $(this).attr('id').replace('pokemonList', '');
        const pokemonId = $droppedPokemon.data('pokemon-id');

        // Update the location of the Pokemon with ID 'pokemonId' in the database
        // Send an AJAX request or update your database here

        $droppedPokemon.appendTo($(this));
      }
    });
  }

  enableDragAndDrop();
});
