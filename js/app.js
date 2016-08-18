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
    if (this.x > 1000) {
        this.x = -100;
        this.y = randomSelect(enemyStartPos);
        this.speed = randomSelect(enemySpeeds);
    }
};

// A function that will randomly select one value from an array of values of any length.
function randomSelect (choicesArray) {
    var random = Math.random();
    random *= choicesArray.length
    random =  Math.floor(random);
    var chosen = choicesArray[random];
    return chosen;
};

// Arrays to allow for random speed / location for non player elements
var enemySpeeds = [100, 200, 300, 400, 500, 600, 700];
var enemyStartPos = [125, 208, 219, 374, 457, 540, 623, 706, 789];
var gemStartPosY = [115, 198, 281, 360, 447, 530, 613, 696, 779];
var gemStartPosX = [22, 123, 224, 325, 426, 527, 628, 729, 830, 931];
var gemTypes = ["blue", "green", "orange"];
var gemResources = {
    "blue": 'images/Gem-Blue.png',
    "green": 'images/Gem-Green.png',
    "orange": 'images/Gem-Orange.png'
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gem class construction function
var Gem = function() {
    colour = randomSelect(gemTypes);
    this.sprite = gemResources[colour];
    this.x = randomSelect(gemStartPosX);
    this.y = randomSelect(gemStartPosY);
    this.width = 60;
    this.height = 57;
    this.colour = colour;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y+20, this.height, this.width);
};

// Obstacle class construction function - not used in submitted project
var Obstacle = function() {
    this.sprite = 'images/Rock.png';
    this.x = randomSelect(gemStartPosX)-20;
    this.y = randomSelect(gemStartPosY);
}

Obstacle.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(canvasWidth, canvasHeight) {
    this.sprite = 'images/char-boy.png';
    this.initPosX = (canvasWidth/2) - 37;
    this.initPosY = canvasHeight - 150;
    this.x = (canvasWidth/2) - 37;
    this.y = canvasHeight - 150;
    this.width = 74;
    this.height = 85;
};

Player.prototype.update = function(dt) {
    // with what?
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
        if (this.x + 10 <= 1010 - 80) {
            this.x += 20;
        }
    } else if (keyInput == 'down') {
        if (this.y + 40 <= 1100 - 120) {
            this.y += 16;
        }
    };
};

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
