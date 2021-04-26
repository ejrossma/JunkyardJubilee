class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload(){
        // load sprites/images
        this.load.image('ground', './assets/64DirtFlipped.png');
        this.load.image('player', './assets/60x78Player.png');
    }
    create() {
        //Set background color
        this.cameras.main.setBackgroundColor('#d6b894');
        //Set Temporary text boxes until buttons are made
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#ffffff',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.title = this.add.text(game.config.width/2, game.config.height*0.25, 'Junkyard Jubilee',
        menuConfig).setOrigin(0.5, 0.5);
        this.playButton = this.add.text(game.config.width/2, game.config.height*0.5, 'PLAY',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive
        this.playButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.playButton.width,
             this.playButton.height), Phaser.Geom.Rectangle.Contains);
        this.playButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });
    }
    update() {
        //temporary start
        //this.scene.start('playScene');
    }
}