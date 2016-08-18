/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 1010;
    var canvasWidth = canvas.width;
    canvas.height = 1100;
    var canvasHeight = canvas.height;
    doc.body.appendChild(canvas);

    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";

    var allEnemies = [];
    var allGems = [];
    // var allObstacles = [];
    var lives = 10;
    var score = 0;
    var level = 1;
    document.getElementById("lives").innerHTML = "Lives: " + lives.toString();
    document.getElementById("score").innerHTML = "Score: " + score.toString();
    document.getElementById("level").innerHTML = "Level: " + level.toString();
    document.getElementById("instructions").innerHTML = "Get the gems before the bugs eat them, avoid the bugs, reach the water, because you think you are a frog";

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        // Place all enemy objects in an array called allEnemies - create a loop so the number of enemies increases each time you increase the level
        for (var i = 0; i < level; i++) {
            allEnemies.push(new Enemy());
        }

        allGems.push(new Gem());

        // Place the player object in a variable called player
        player = new Player(canvasWidth, canvasHeight);
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        addGems();
        // addObstacles();
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function addGems() {
        if (Math.random() < 0.001) {
            allGems.push(new Gem());
        }
    }

    // function addObstacles() {
    //     if (Math.random() < 0.001) {
    //         allObstacles.push(new Obstacle());
    //     }
    // }

    function checkCollisions() {
        // check the postion of the player against enemies, gems and the finish line
        // If collide with enemy. Return player to start position. Reduce var lives by one. If var lives < 0 reset game completely.
        allEnemies.forEach(function(enemy) {
            if (player.x > enemy.x - 70 && player.x < enemy.x + 70 && player.y > enemy.y - 80 && player.y < enemy.y + 10) {
                if (lives <= 1) { // Reset the game to the beginning
                    player.x = (canvasWidth/2) - 37;
                    player.y = canvasHeight - 150;
                    score = 0;
                    lives = 10;
                    level = 1;
                    document.getElementById("lives").innerHTML = "Lives: " + lives.toString();
                    document.getElementById("score").innerHTML = "Score: " + score.toString();
                    document.getElementById("level").innerHTML = "Level: " + level.toString();
                } else {
                    lives -= 1;
                    player.x = (canvasWidth/2) - 37;
                    player.y = canvasHeight - 150;
                    document.getElementById("lives").innerHTML = "Lives: " + lives;
                };
            }
            // Check for enemy collision with Gems
            for (var i = 0; i < allGems.length; i++) {
                gem = allGems[i];
                if (enemy.x + 90 > gem.x && enemy.x < gem.x + gem.width && enemy.y > gem.y && enemy.y < gem.y + gem.height) {
                    allGems.splice(i, 1);
                };
            }
        });

        // If player collides with gem. Increase var score depending on which colour.
        for (var i = 0; i < allGems.length; i++) {
            gem = allGems[i];
            if (player.x + 44  > gem.x && player.x + 44 < gem.x + gem.width && player.y + 45 > gem.y && player.y + 45 < gem.y + gem.height) {
                if (gem.colour == "orange") {
                    score += 2
                } else if (gem.colour == "blue") {
                    score += 4
                } else if (gem.colour == "green") {
                    score += 6
                };
                allGems.splice(i, 1);
                document.getElementById("score").innerHTML = "Score: " + score;
            };
        }

        // If collide with finish. Draw some success graphic. Return to start point. Increase var score by 50. Increase var level by 1.
        if (player.y < 50) {
            player.x = player.initPosX;
            player.y = player.initPosY;
            score += 50;
            level += 1;
            document.getElementById("score").innerHTML = "Score: " + score.toString();
            document.getElementById("level").innerHTML = "Level: " + level.toString();
            init()
        };
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        var numRows = 12,
            numCols = 10,
            row, col;

        var water = 'images/water-block.png',
            stone = 'images/stone-block.png',
            grass = 'images/grass-block.png';

        // Added sprite map to render game background
        var baseImage = [
            [water, water, water, water, water, water, water, water, water, water],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass]
        ];


        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                // ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83); = old code
                ctx.drawImage(Resources.get(baseImage[row][col]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the various arrays and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allGems.forEach(function(gem) {
            gem.render();
        });
        // allObstacles.forEach(function(obstacle) {
        //     obstacle.render();
        // });

        player.render();

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // Reset enemies and gems arrays
        allEnemies = [];
        allGems = [];
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
