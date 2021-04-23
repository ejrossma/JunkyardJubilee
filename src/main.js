//game configuration
let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 480,
    scene: [ Menu, Play, ],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

let game = new Phaser.Game(config);

let borderSize = game.config.height / 15;