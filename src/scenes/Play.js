class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //add explosion animation
        this.load.spritesheet('smallexplosion', './assets/small_explosion64.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 8
        });
        //add robot buddy
        this.load.image('safeMode', './assets/pngs/shootSphere.png');
        this.load.image('shootMode', './assets/pngs/shootSphereFire.png')
    }

    create() {
        //set cursor
        this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');

        //Set background color
        this.cameras.main.setBackgroundColor('#d6b894'); 
        //set background
        this.back1 = this.add.tileSprite(0, 0, 800, 480, 'back1').setOrigin(0, 0);
        this.back2 = this.add.tileSprite(0, 0, 800, 480, 'back2').setOrigin(0, 0);
        this.back3 = this.add.tileSprite(0, 0, 800, 480, 'back3').setOrigin(0, 0);
        this.back4 = this.add.tileSprite(0, 0, 800, 480, 'back4').setOrigin(0, 0);
        this.back5 = this.add.tileSprite(0, 0, 800, 480, 'back5').setOrigin(0, 0);

        // variables and settings
        this.JUMP_VELOCITY = -800;              // lower -> cant jump as high, higher -> can jump higher
        this.MAX_JUMPS = 1;                     // amount of jumps the player can do (default to 1)
        this.BASE_SPEED = 4;
        this.SCROLL_SPEED = 4;                  // how fast the tiles are moving below
        this.physics.world.gravity.y = 2600;    // this was default physics, I changed it to higher and it didnt work, so idk if we can change
        this.whichObstacle = 1;     // choose obstacle
        this.obstacleDeployed = true;                      // bool that controls when obstacles spawn
        this.gameOver = false;                              // game over boolean
        this.OBSTACLE_SPEED = -280;                         // speed that the jumping obstacles move
        this.speedMultiplier = 1;
        this.MAX_OBSTACLES = 0;                  // maximum number of obstacles that can be spawned at a time
        this.CURRENT_OBSTACLES_AMT = 0;          // how many obstacles are currently spawned
        this.JUMP_OBS_ALLOWED = true;              // bool to see whether another jump obs can be spawned

        //delayed call for first obstacle
        this.obstacleTimer = this.time.delayedCall (2000, () => { this.obstacleDeployed = false; });

        this.speedTimer = this.time.addEvent({
            delay: 5000,
            callback: this.adjustSpeed,
            callbackScope: this,
            loop: true
        });

        //temporary call for meteor
        this.meteorGroup = this.add.group({
            runChildUpdate: true                // update runs on meteors
        });

        // temporary call for jump obstacle
        this.jumpObsGroup = this.add.group({
            runChildUpdate: true
        });

        // create the ground tiles using the ground.png that covers the bottom of game screen (default tileSize = 16 which can be changed later)
        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i+= tileSize) 
        {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'junkyardAtlas', 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // ground scroll variable
        this.groundScroll = this.add.tileSprite(0,game.config.height-tileSize, game.config.width, tileSize, 'ground').setOrigin(0);

        // create the player (x, y, image)
        this.player = this.physics.add.sprite(100, game.config.height - tileSize*2, 'junkyardAtlas', 'robotRun0001').setScale(SCALE);
        //add player buddy
        this.player.buddy = this.add.sprite(125, game.config.height - tileSize*2 - 25, 'safeMode');
        //setup player animation from texture atlas
        this.anims.create({
            key: 'robotRun',
            frames: this.anims.generateFrameNames('junkyardAtlas', {
                prefix: 'robotRun',
                start: 1,
                end: 7,
                suffix: '',
                zeroPad: 4
                }),
            frameRate:30,
            repeat: -1
        });
        this.player.anims.play('robotRun');

        //meteor explosion
        this.anims.create({
            key: 'smallexplode',
            frames: this.anims.generateFrameNumbers('smallexplosion', {
                start: 0,
                end: 8,
                first: 0
            }),
            frameRate: 30
        });
        // cursor key input (aka keyboard keys which are written in lowercase)
        cursors = this.input.keyboard.createCursorKeys();

        // physics collider (makes so the player can't pass through ground)
        this.physics.add.collider(this.player, this.ground);
        //adds collider with player and meteors
        this.physics.add.collider(this.ground, this.meteorGroup);
        // add collider with jump
        this.physics.add.collider(this.ground, this.jumpObstacle);
        //score variables/misc
        this.obstaclesJumped = 0;
        this.distanceTravelled = 0;
        this.obstaclesDestroyed = 0;
        this.timesJumped = 0;
        this.firstJump = true;

        // music
        this.MAX_VOL = 0.125;
        this.VOL = 0;
        this.music = this.sound.add('BGM');
        this.music.setLoop(true);
        this.music.setVolume(this.VOL);
        this.music.play();

    }

    update(time, delta) {
        this.distanceTravelled += 0.1*this.speedMultiplier;
        let deltaMultiplier = (delta/16.66667);
        this.back1.tilePositionX -= 0.05*deltaMultiplier;
        this.back2.tilePositionX -= 0.07*deltaMultiplier;
        this.back3.tilePositionX -= 0.1*deltaMultiplier;
        this.back4.tilePositionX -= 0.15*deltaMultiplier;
        // Check if collides
        this.physics.world.collide(this.player, this.meteorGroup, this.playerHit, null, this);
        this.physics.world.collide(this.player, this.jumpObsGroup, this.playerHit, null, this);
        
        // update tiles (aka the ground scrolls)
        this.groundScroll.tilePositionX += this.SCROLL_SPEED*deltaMultiplier;

        // check if player is on the ground
        if (!this.gameOver)
        {
            if (this.player.y > 396) {
                this.player.isGrounded = true;
            }
            this.adjustBuddy();
        }
        
        // if grounded, allow them to jump
        if (!this.gameOver && this.player.isGrounded)
        {
            this.player.anims.play('robotRun', true);  // placeholder walk animation spot
            this.jumps = this.MAX_JUMPS;
            this.jumping = false;
        } else {
            this.player.setFrame('robotRun0001');
        }

        // detect how long the user presses the space(jump) key and jump accordingly
        if (!this.gameOver && this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.space, 150)) 
        {
            this.player.body.velocity.y = this.JUMP_VELOCITY;
            if(this.firstJump){
                this.sound.play('jumpSound');           //play the jump sound
                this.firstJump = false;
                this.timesJumped += 1;
                this.stopSound = this.time.delayedCall (200, () => { this.firstJump = true; });
            }
            this.jumping = true;
            this.player.isGrounded = false;
        }

        // when key is let go of, allow for player to jump again
        if (!this.gameOver && this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.space))
        {
            this.jumps--;
            this.jumping = false;
            this.firstJump = true;
        }
        // deploy the obstacles in the game
        if (!this.gameOver && this.CURRENT_OBSTACLES_AMT < this.MAX_OBSTACLES && this.obstacleDeployed == false)
        {
            this.obstacleDeployed = true;
            this.CURRENT_OBSTACLES_AMT++;
            this.addObstacle(deltaMultiplier);
        }

        // when game is over
        if (this.gameOver == true)
        {
            this.player.x -= this.SCROLL_SPEED;

            if (this.player.x <= 0)
            {
                this.player.destroy();
            }

            this.player.buddy.y--;
        }

        // update amount of objects spawned
        if (!this.gameOver && this.SCROLL_SPEED < 5)
        {
            this.MAX_OBSTACLES = 1;
        }
        else if (!this.gameOver && this.SCROLL_SPEED >=5 && this.SCROLL_SPEED < 7)
        {
            this.MAX_OBSTACLES = 2;
        }
        else if (!this.gameOver && this.SCROLL_SPEED >=7 && this.SCROLL_SPEED < 9)
        {
            this.MAX_OBSTACLES = 3;
        }
        else if (!this.gameOver && this.SCROLL_SPEED >=9 && this.SCROLL_SPEED < 11)
        {
            this.MAX_OBSTACLES = 4;
        }
        else if (!this.gameOver && this.SCROLL_SPEED >=13)
        {
            this.MAX_OBSTACLES = 5;
        }

        // fade in music
        if (!this.gameOver && this.VOL < this.MAX_VOL)
        {
            this.VOL += .0001;
            this.music.setVolume(this.VOL);
            //console.log(this.VOL);
        }
        else if (this.gameOver == true && this.VOL > 0)
        {
            this.VOL -= .001;
            this.music.setVolume(this.VOL);
        }
        else if (this.gameOver == true && this.VOL <= 0)
        {
            this.music.stop();
        }
    }

    // when player is hit
    playerHit()
    {
        this.sound.play('hitSound');
        this.player.body.velocity.y = this.JUMP_VELOCITY;
        this.gameOver = true;
        this.loseScreen();
        //console.log('game over');
    }

    // add an obstacle
    addObstacle(deltaMultiplier)
    {
        // check if a jumpObs can be spawned without overlap
        if (this.JUMP_OBS_ALLOWED == true)
        {
            this.whichObstacle = Phaser.Math.Between(1,2);
        }
        else
        {
            this.whichObstacle = Phaser.Math.Between(2,2);
        }
        //console.log("Obstacle Deployed");
        // check which obstacle is being spawned
        if (this.whichObstacle == 1)
        {
            // set bool
            this.JUMP_OBS_ALLOWED = false;
            this.addJumpObstacle();
        }
        else if(this.whichObstacle == 2)
        {
            this.addMeteor(deltaMultiplier);
        }
        
    }

    //adds a jump obstacle
    addJumpObstacle()
    {
        this.whichJumpObstacle = Phaser.Math.Between(1, 2);
        if (this.whichJumpObstacle == 1)
        {
            let jumpObs = new jumpObstacle(this, game.config.width + tileSize, game.config.height - tileSize*1.32, 'carObject').setScale(0.9).setOrigin(0.5, 0.5);
            this.jumpObsGroup.add(jumpObs);
            this.obstacleDeployed = false;
        }
        else
        {
            let jumpObs= new jumpObstacle(this, game.config.width + tileSize, game.config.height - tileSize*1.45, 'boxObject').setScale(0.9).setOrigin(0.5, 0.5);
            this.jumpObsGroup.add(jumpObs);
            this.obstacleDeployed = false;
        }
    }

    //adds a meteor
    addMeteor(deltaMultiplier){
        //set to 7 for testing
        this.spawn = Phaser.Math.Between(45, 90) * 10;
        if(Phaser.Math.Between(1,2) == 1){
            let fallingObs = new Meteor(this, this.spawn, this.SCROLL_SPEED*deltaMultiplier, 'carDoor').setOrigin(0.5, 0.5);
            this.meteorGroup.add(fallingObs);
            this.obstacleDeployed = false;
            fallingObs.setInteractive(new Phaser.Geom.Rectangle(0, 0, fallingObs.width,
                fallingObs.height), Phaser.Geom.Rectangle.Contains);
            fallingObs.on('pointerover', () => {
                this.player.buddy.setTexture('shootMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair_fire.png) 32.5 32.5, pointer');
            });
            fallingObs.on('pointerout', () => {
                this.player.buddy.setTexture('safeMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');
            });
            fallingObs.on('pointerdown', () => {
                let explode = this.add.sprite(fallingObs.x - 32, fallingObs.y - 32, 'smallexplode').setOrigin(0);
                explode.anims.play('smallexplode');
                this.sound.play('destroySound');
                this.obstaclesDestroyed += 1;
                fallingObs.destroyObj();
                this.player.buddy.setTexture('safeMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');
                explode.on('animationcomplete', () => {
                    explode.destroy();
                });
            });
        }
        else{
            let fallingObs = new Meteor(this, this.spawn, this.SCROLL_SPEED*deltaMultiplier, 'tire').setOrigin(0.5, 0.5);
            this.meteorGroup.add(fallingObs);
            this.obstacleDeployed = false;
            fallingObs.setInteractive(new Phaser.Geom.Rectangle(0, 0, fallingObs.width,
                fallingObs.height), Phaser.Geom.Rectangle.Contains);
            fallingObs.on('pointerover', () => {
                this.player.buddy.setTexture('shootMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair_fire.png) 32.5 32.5, pointer');
            });
            fallingObs.on('pointerout', () => {
                this.player.buddy.setTexture('safeMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');
            });
            fallingObs.on('pointerdown', () => {
                let explode = this.add.sprite(fallingObs.x - 32, fallingObs.y - 32, 'smallexplode').setOrigin(0);
                explode.anims.play('smallexplode');
                this.sound.play('destroySound');
                this.obstaclesDestroyed += 1;
                fallingObs.destroyObj();
                this.player.buddy.setTexture('safeMode');
                //set cursor
                this.input.setDefaultCursor('url(assets/pngs/crosshair.png) 32.5 32.5, pointer');
                explode.on('animationcomplete', () => {
                    explode.destroy();
                });
            fallingObs.wheel = true;
            });
        }

        
    }
    adjustSpeed() {
        if (this.SCROLL_SPEED < 13) {
            //console.log("speed increased");
            this.speedMultiplier += 1;
            this.SCROLL_SPEED = this.BASE_SPEED + (0.2 * this.speedMultiplier);
            //console.log(this.SCROLL_SPEED);
        }
    }

    
    loseScreen(){
        //change crosshair back to cursor
        this.input.setDefaultCursor();
        this.lose = this.add.tileSprite(400, 125, 400, 200, 'gameOverCard').setOrigin(0.5, 0.5);
        this.gameOver = true;
        // When player loses, make it so they can return to to the menu by pressing the button.
        //temp until buttons are made
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            backgroundColor: '#ffffff',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.return = this.add.text(game.config.width/2, 260, "obstacles jumped: " + this.obstaclesJumped,
        menuConfig).setOrigin(0.5, 0.5);
        this.return = this.add.text(game.config.width/2, 300, "obstacles destroyed: " + this.obstaclesDestroyed,
        menuConfig).setOrigin(0.5, 0.5);
        this.return = this.add.text(game.config.width/2, 340, "distance travelled: " + Math.floor(this.distanceTravelled) + " ft",
        menuConfig).setOrigin(0.5, 0.5);
        this.return = this.add.text(game.config.width/2, 380, "total times jumped: " + this.timesJumped,
        menuConfig).setOrigin(0.5, 0.5);
        this.return = this.add.text(game.config.width*0.4, 430, 'MENU',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive
        this.return.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.return.width,
             this.return.height), Phaser.Geom.Rectangle.Contains);
        this.return.on('pointerdown', () => {
            this.sound.play('select');
            this.music.stop();
            this.scene.start('menuScene');
        });
        //add restart button
        this.restartGame = this.add.text(game.config.width*0.58, 430, 'RESTART',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive
        this.restartGame.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.restartGame.width,
             this.restartGame.height), Phaser.Geom.Rectangle.Contains);
        this.restartGame.on('pointerdown', () => {
            this.sound.play('select');
            this.scene.restart();
        });
    }

    adjustBuddy() {
        if (this.player.buddy.x < this.player.x + 20)
            this.player.buddy.x+=2;
        else if (this.player.buddy.x > this.player.x + 30)
            this.player.buddy.x-=2;

        if (this.player.buddy.y < this.player.y - 30)
            this.player.buddy.y+=2;
        else if (this.player.buddy.y > this.player.y - 20)
            this.player.buddy.y-=2;
    }
}