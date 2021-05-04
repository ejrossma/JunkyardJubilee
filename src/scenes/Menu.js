class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload(){
        // load sprites/images/audio
        this.load.image('ground', './assets/pngs/junkyardGround.png');
        this.load.image('tire', './assets/pngs/tire.png');
        this.load.image('carDoor', './assets/pngs/carDoor.png');
        this.load.image('back1', './assets/pngs/background/tempBackground1.png');
        this.load.image('back2', './assets/pngs/background/tempBackground2.png');
        this.load.image('back3', './assets/pngs/background/tempBackground3.png');
        this.load.image('back4', './assets/pngs/background/tempBackground4.png');
        this.load.image('back5', './assets/pngs/background/tempBackground5.png');
        this.load.image('back6', './assets/pngs/background/tempBackground6.png');
        this.load.image('titleCard', './assets/pngs/background/titleCard.png');
        this.load.image('gameOverCard', './assets/pngs/background/gameOverCard.png');
        this.load.image('instructions', './assets/pngs/background/instructions.png');
        this.load.image('carObject', './assets/pngs/carObject.png');
        this.load.image('boxObject', './assets/pngs/boxObject.png');
        this.load.audio('destroySound', './assets/PewPew.wav');
        this.load.audio('jumpSound', './assets/jumpSound.wav');
        this.load.audio('hitSound', './assets/hitSound.wav');
        this.load.audio('select', './assets/select.wav');
        //this.load.audio('BGM', './assets/JunkYardJubileeBGM.wav');

        this.load.atlas('junkyardAtlas', 'assets/textureAtlas.png', 'assets/textureAtlas.json');
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
        this.back6 = this.add.tileSprite(0, 0, 800, 480, 'back6').setOrigin(0, 0);

        //set cursor
        this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');

        this.credits = this.add.text(game.config.width/2, game.config.height*0.97, 'Game created by Elijah Rossman, Kevin Lewis, Kristopher Yu',{
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff',
            align: 'left',
        }).setOrigin(0.5, 0.5);
        //Set Temporary text boxes until buttons are made
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '56px',
            backgroundColor: '#9e9e9e',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        let instructionConfig = {
            fontFamily: 'Courier',
            fontSize: '56px',
            backgroundColor: '#9e9e9e',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 400
        }
        //the normal play button
        this.playButton = this.add.text(game.config.width*0.25, game.config.height*0.7, 'Normal',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive so that it brings you to play scene
        this.playButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.playButton.width,
             this.playButton.height), Phaser.Geom.Rectangle.Contains);
        this.playButton.on('pointerdown', () => {
            GAME_SPEED = 4;
            SPEED_MULTIPLIER = 1;
            MAX_SPEED = 13;
            this.sound.play('select');
            this.scene.start('playScene');
        });
        //the hard play button
        this.playButton = this.add.text(game.config.width*0.75, game.config.height*0.7, 'Hard',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive so that it brings you to play scene
        this.playButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.playButton.width,
             this.playButton.height), Phaser.Geom.Rectangle.Contains);
        this.playButton.on('pointerdown', () => {
            GAME_SPEED = 4;
            SPEED_MULTIPLIER = 2;
            MAX_SPEED = 18;
            this.sound.play('select');
            this.scene.start('playScene');
        });
        //instructions button
        this.instructionButton = this.add.text(game.config.width/2, game.config.height*0.87, 'HOW TO PLAY',
        instructionConfig).setOrigin(0.5, 0.5);
        //set button as interactive
        this.instructionButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.instructionButton.width,
            this.instructionButton.height), Phaser.Geom.Rectangle.Contains);
        //set commands to do when pressed
        this.instructionButton.on('pointerdown', () => {
            //remove old play button and instruction button
            this.playButton.destroy();
            this.instructionButton.destroy();
            this.sound.play('select');
            //add tutorial card
            this.tutorial = this.add.tileSprite(0, 0, 800, 480, 'instructions').setOrigin(0, 0);
            //set menu button
            this.menuButton = this.add.text(game.config.width*0.8, game.config.height*0.8, 'MENU',
            menuConfig).setOrigin(0.5, 0.5);
            //set interactive so that it brings you to menu scene
            this.menuButton.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.menuButton.width,
                 this.menuButton.height), Phaser.Geom.Rectangle.Contains);
            this.menuButton.on('pointerdown', () => {
                this.sound.play('select');
                this.scene.restart();
            });
       });
       
        //add title card
        this.title = this.add.tileSprite(400, 125, 720, 210, 'titleCard').setOrigin(0.5, 0.5);
    }

    update(time, delta){
        //paralax background
        let deltaMultiplier = (delta/16.66667);
        this.back1.tilePositionX += 0.05*deltaMultiplier;
        this.back2.tilePositionX += 0.1*deltaMultiplier;
        this.back3.tilePositionX += 0.2*deltaMultiplier;
        this.back4.tilePositionX += 0.5*deltaMultiplier;
        this.back5.tilePositionX += 0.7*deltaMultiplier;
        this.back6.tilePositionX += 1*deltaMultiplier;
    }
}