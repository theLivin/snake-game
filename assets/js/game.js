// Declare global variables
var snake, apple, squareSize, score, speed,
    updateDelay, direction, newDirection,
    addNew, cursors, scoreTextValue, speedTextValue,
    textStyleKey, textStyleValue ;


var Game = {
    preload: function(){
        // Here we load all the needed resources for the level.
        // In our case, that's just two squares - one for the snake body and one for the apple.
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },

    create: function(){
        // By setting up global variables in the create function, we initialize them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];             // This will work as a stack, containing parts of our snake
        apple = {};             // An object for the apple
        squareSize = 15;        // The length of a side of the squares. Our image is 15x15 pixels
        score = 0;              // Game score
        speed = 0;              // Game speed
        updateDelay = 0;        // A variable for control over update rates
        direction = 'right';    // The direction of our snake
        newDirection = null;    // A buffer to store the new direction into
        addNew = false;         // A variable used when an apple has been eaten


        // Setup a Phaser controller for keyboard inputs
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        
        // Generate the initial snake stack. Our snake will be 10 elements long(ie. 10 snake square images long).
        // Beginning at X=150 Y=150 and increasing the X on every iteration
        for(var i=0; i<10; i++){
            // Params are (x coordinate, y coordinate, image)
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');

        }

        // Generate the first apple
        this.generateApple();

        // Add text to top of game
        textStyleKey = {font: "bold 14px sans-serif", fill: "#46c0f9", align: "center"};
        textStyleValue = {font: "bold 18px sans-serif", fill: "#fff", align: "center"};

        // Score
        game.add.text(30, 20, "SCORE", textStyleKey);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyleValue);


        // Speed
        game.add.text(500, 20, "SPEED", textStyleKey);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyleValue);
    },

    update: function() {
        // The update function is called constantly at a high rate (somewhere around 60fps),
        // updating the game field every time

        // Handle arrow key presses while not allowing illegal direction changes that will kill the player
        if(cursors.right.isDown && direction != 'left'){
            newDirection = 'right';
        }
        else if(cursors.left.isDown && direction != 'right'){
            newDirection = 'left';
        }
        else if(cursors.up.isDown && direction != 'down'){
            newDirection = 'up';
        }
        else if(cursors.down.isDown && direction != 'up'){
            newDirection = 'down';
        }

        // A formula to calculate the game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10
        speed = Math.min(10, Math.floor(score/5));

        // Update the speed value on the game screen
        speedTextValue.text = '' + speed;
        
        
        
        // Since the update function of Phaser has an update rate of around 60fps,
        // we need to slow it down in order to make the game playable.
        // Increase a counter on every update call
        updateDelay++;

        // Do game stuff only if counter is aliquot to (10 - the game speed)
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster
        if( updateDelay % (10 - speed) == 0){
            
            // Snake movement
            // Move last square of snake (first elem in stack)
            // and give it coordinates according to the current snake direction
            // and place it infront of the head of the snake (top of the stack)
            // Remember: last element is the snake's head ie. firstCell
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // If a new direction has been chosen from the keyboard, make it the dirction of the snake now
            if(newDirection){
                direction = newDirection;
                newDirection = null;
            }

            // Change the last cell's coordinates relative to the head of the snake, according to the direction.
            if(direction == 'right'){
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }

            // Place the last cell inf front of the stack
            snake.push(lastCell);

            // Mark it the first cell
            firstCell = lastCell;


            // Increase length of snake if an apple has been eaten.
            // Create a block in the the back of the snake with the old position of the previous last block
            // (it has move now along wit the rest of the snake)
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Check for apple collision
            this.appleCollision();

            // Check for collision with self.
            // Param is the head of the snake
            this.selfCollision(firstCell);

            // Check with collision with wall.
            // Parameter is the head of the snake
            this.wallCollision(firstCell);

        }

    },

    generateApple: function(){
        // Choose a random place on the grid
        // X is between 0 and 585 ( 39*15 )
        // Y is between 0 and 435 ( 29*15 )

        var randomX = Math.floor(Math.random() * 40) * squareSize;
        var randomY = Math.floor(Math.random() * 30) * squareSize;

        // Add a new apple
        apple = game.add.sprite(randomX, randomY, 'apple');
    },


    appleCollision: function(){
        // Check if any part of the snake is overlapping the apple.
        // This is needed if the apple spawns inside of the snake.
        for(var i=0; i<snake.length; i++){
            if(snake[i].x == apple.x && snake[i].y == apple.y){

                // Next time the snake moves, a new block will be added to its length
                addNew = true;

                // Destroy the old apple
                apple.destroy();

                // Make a new apple
                this.generateApple();

                // Increase score
                score++;

                // Refresh scoreboard
                scoreTextValue.text = score.toString();
            }
        }
    },


    selfCollision: function(head){
        // Check if the head of the snake overlaps with any part of the snake
        for(var i=0; i<snake.length -1 ; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){
                // If so, go to the game over screen
                game.state.start('Game_Over');
            }
        }
    },


    wallCollision: function(head){
        // Check if the head of the snake is in the boundaries of the game field
        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){
            // If it's not in the game area, we've hit a wall. Hence game over to the screen
            game.state.start('Game_Over');
        }
    }
};