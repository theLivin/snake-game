var Menu = {
    // First function that is called when state is started
    preload: function() {
        // -- LOAD ALL THE NEEDED RESOURCE FOR THE MENU
        // Loading images is required so that later on we can create sprites based on them.
        // The first argument is how our image will be referred to,
        // the second argument is the path to our file
        game.load.image('menu', './assets/images/menu.png');
    },

    // Once preloading finishes, create gets called, initializing the playing field
    // and everything we want.
    create: function() {
        // -- ADD MENU SCREEN
        // Add a sprite to the game. Here, the sprite will be the game's logo
        // Parameters are : x, y, image_name
        // this.add.sprite(0, 0, 'menu');

        // This will act as a button that will start the game
        this.add.button(0,0, 'menu', this.startGame, this);
    },

    startGame: function() {
        // Change the state to the actual game
        this.state.start('Game');
    }
};