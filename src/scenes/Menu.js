class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload(){
        // load sprites/images
        this.load.image('ground', './assets/dirtTile.png');
        this.load.image('player', './assets/player.png');
        this.load.image('back1', './assets/tempBackground1.png');
        this.load.image('back2', './assets/tempBackground2.png');
        this.load.image('back3', './assets/tempBackground3.png');
        this.load.image('back4', './assets/tempBackground4.png');
        this.load.image('back5', './assets/tempBackground5.png');
    }
    create() {
        //Set background color
        this.cameras.main.setBackgroundColor('#d6b894'); 
        //set background
        this.back1 = this.add.tileSprite(0, 0, 800, 480, 'back1').setOrigin(0, 0);
        this.back2 = this.add.tileSprite(0, 0, 800, 480, 'back2').setOrigin(0, 0);
        this.back3 = this.add.tileSprite(0, 0, 800, 480, 'back3').setOrigin(0, 0);
        this.back4 = this.add.tileSprite(0, 0, 800, 480, 'back4').setOrigin(0, 0);
        this.back5 = this.add.tileSprite(0, 0, 800, 480, 'back5').setOrigin(0, 0);
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
    update(time, delta){
        let deltaMultiplier = (delta/16.66667);
        this.back1.tilePositionX -= 0.05*deltaMultiplier;
        this.back2.tilePositionX -= 0.07*deltaMultiplier;
        this.back3.tilePositionX -= 0.1*deltaMultiplier;
        this.back4.tilePositionX -= 0.15*deltaMultiplier;
    }
}