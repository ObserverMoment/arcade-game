// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = randomSelect(enemyStartPos);
    this.speed = randomSelect(enemySpeeds);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    // When the enemy leaves the right of the screen - reset back to start point and randomly select speed and row position
    if (this.x > 600) {
        this.x = -100;
        this.y = randomSelect(enemyStartPos);
        this.speed = randomSelect(enemySpeeds);
    }
};

function randomSelect (choicesArray) {
    var random = Math.random();
    random *= choicesArray.length
    random =  Math.floor(random);
    var chosen = choicesArray[random];
    return chosen;
};

var enemySpeeds = [100, 200, 300, 400, 500, 600, 700];
var enemyStartPos = [55, 138, 221];
var gemStartPosY = [115, 198, 281];
var gemStartPosX = [22, 123, 224, 325, 426];

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem class construction function
var Gem = function() {
    this.sprite = 'images/Gem-Orange.png';
    this.x = randomSelect(gemStartPosX);
    this.y = randomSelect(gemStartPosY);
    this.width = 85.5;
    this.height = 50.5;
};

Gem.prototype.update = function() {
    // Update how??
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.height, this.width);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(canvasWidth, canvasHeight) {
    this.sprite = 'images/char-boy.png';
    this.x = (canvasWidth/2) - 37;
    this.y = canvasHeight - 150;
    this.width = 74;
    this.height = 85;
};

Player.prototype.update = function(dt) {
    // Update how??
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyInput) {
    if (keyInput == 'left') {
        if (this.x - 10 >= 0) {
            this.x -= 20;
        }
    } else if (keyInput == 'up') {
        if (this.y - 40 >= -50) {
            this.y -= 16;
        }
    } else if (keyInput == 'right') {
        if (this.x + 10 <= 435) {
            this.x += 20;
        }
    } else if (keyInput == 'down') {
        if (this.y + 40 <= 480) {
            this.y += 16;
        }
    };
};

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
