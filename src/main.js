//game configuration
let config = {
    type: Phaser.CANVAS,
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
let cursors;
//High score
let topScore = 0;
const SCALE = 0.5;
const tileSize = 16;