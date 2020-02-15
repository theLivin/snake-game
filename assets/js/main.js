var game;

// Create a new game instance 600px wide and 450px tall
game = new Phaser.Game(600, 450, Phaser.AUTO, '');

// First param is how our state will be called
// Second param is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);


// Add the Game state
game.state.add('Game', Game);


// Add the Game over state
game.state.add('Game_Over', Game_Over)


game.state.start('Menu');