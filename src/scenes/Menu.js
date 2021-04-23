class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load sprites/images
        this.load.image('ground', './assets/ground.png');
        this.load.image('player', './assets/player.png');
    }

    create() {
        this.scene.start('playScene');
    }
}