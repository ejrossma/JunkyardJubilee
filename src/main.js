//game configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    scene: [ Menu, Play, ],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // turn true to enable the collision borders/barriers
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
}

let game = new Phaser.Game(config);

// global variables
let borderSize = game.config.height / 15;
let playerPadding = borderSize / 3;
let cursors;
// global speed variable
let SPEED_MULTIPLIER;
let GAME_SPEED;
let MAX_SPEED;
//High score
let topScore = 0;
const SCALE = 0.5;
const tileSize = 64;