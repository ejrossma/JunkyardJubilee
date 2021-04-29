class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //set cursor
        this.input.setDefaultCursor('url(assets/crosshair.png), pointer');

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
        // cursor key input (aka keyboard keys which are written in lowercase)
        cursors = this.input.keyboard.createCursorKeys();

        // physics collider (makes so the player can't pass through ground)
        this.physics.add.collider(this.player, this.ground);
        //adds collider with player and meteors
        this.physics.add.collider(this.ground, this.meteorGroup);
        this.obstaclesJumped = 0;
        this.distanceTravelled = 0;
        this.obstaclesDestroyed = 0;
        this.timesJumped = 0;
    }

    update(time, delta) {
        this.distanceTravelled += 0.1*this.speedMultiplier;
        let deltaMultiplier = (delta/16.66667);
        this.back1.tilePositionX -= 0.05*deltaMultiplier;
        this.back2.tilePositionX -= 0.07*deltaMultiplier;
        this.back3.tilePositionX -= 0.1*deltaMultiplier;
        this.back4.tilePositionX -= 0.15*deltaMultiplier;
        // Check if collides
        this.physics.world.collide(this.player, this.meteorGroup, this.loseScreen, null, this);
        
        // update tiles (aka the ground scrolls)
        this.groundScroll.tilePositionX += this.SCROLL_SPEED*deltaMultiplier;

        // check if player is on the ground
        if (!this.gameOver)
        {
            if (this.player.y > 396) {
                this.player.isGrounded = true;
                console.log("grounded");
            }
        }
        
        // if grounded, allow them to jump
        if (!this.gameOver && this.player.isGrounded)
        {
            this.player.anims.play('robotRun', true);  // placeholder walk animation spot
            this.jumps = this.MAX_JUMPS;
            this.jumping = false
        } else {
            this.player.setFrame('robotRun0001');
        }

        // detect how long the user presses the space(jump) key and jump accordingly
        if (!this.gameOver && this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.space, 150)) 
        {
            this.player.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
            this.player.isGrounded = false;
            this.timesJumped += 1;
        }

        // when key is let go of, allow for player to jump again
        if (!this.gameOver && this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.space))
        {
            this.jumps--;
            this.jumping = false;
        }
        // deploy the obstacles in the game **conditions: game is not over && an object is not deployed (a buffer boolean)**
        if (!this.gameOver && this.obstacleDeployed == false)
        {
            this.obstacleDeployed = true;                           // set to true to prevent more than one spawning at a time
            this.whichObstacle = Phaser.Math.Between(1,2);          // randomly select obstacle (1 at the moment)
            console.log("Obstacle Deployed");
            // check which obstacle is being spawned
            if (this.whichObstacle == 1)
            {
                // for this particular obstacle there is 2 variations so spawn whichever is randomly generated
                this.whichJumpObstacle = Phaser.Math.Between(1, 2);
                if (this.whichJumpObstacle == 1)
                {
                    // obstacle that is 128 x 64
                    this.jumpObstacle = this.physics.add.sprite(game.config.width + tileSize, game.config.height - tileSize*1.32, 'carObject').setScale(0.9);    // spawn sprite
                    this.jumpObstacle.body.allowGravity = false;            // disable gravity
                    this.jumpObstacleDeployed = true;                       // tell which obstacle is deployed (for checking later)
                    this.jumpObstacle.immovable = true;
                    this.physics.add.collider(this.jumpObstacle, this.ground);
                }
                else if (this.whichJumpObstacle == 2)
                {
                    // obstacle that is 64 x 64
                    this.jumpObstacle = this.physics.add.sprite(game.config.width + tileSize, game.config.height - tileSize*1.45, 'boxObject').setScale(0.9);    // spawn sprite
                    this.jumpObstacle.body.allowGravity = false;            // disable gravity
                    this.jumpObstacleDeployed = true;                       // tell which obstacle is deployed (for checking later)
                    this.jumpObstacle.immovable = true;
                    this.physics.add.collider(this.jumpObstacle, this.ground);
                }
            }
            else if(this.whichObstacle == 2){
                this.obstacleDeployed = true;
                this.addMeteor(deltaMultiplier);
            }
        }
 
        // jump obstacle checking
        if (this.jumpObstacleDeployed == true)
        {
            this.jumpObstacle.x -= this.SCROLL_SPEED*deltaMultiplier;   // move the jump obstacle towards player
 
            // if obstacle reaches the end of the screen, destroy it.
            if (this.jumpObstacle.x <= 0 - this.jumpObstacle.width) {
                this.jumpObstacle.destroy();        // destroy object
                this.obstaclesJumped += 1;          //increment times jumped
                console.log('Object Destroyed');    // debugging
                this.jumpObstacleDeployed = false;  // reset boolean
                this.obstacleDeployed = false;       // allow for new obstacle to be deployed
            }
 
            // check for collision with player
            this.physics.world.collide(this.player, this.jumpObstacle, this.playerHit, null, this);
        }

        if (this.gameOver == true)
        {
            this.player.x -= this.SCROLL_SPEED;

            if (this.player.x <= 0)
            {
                this.player.destroy();
            }
        }
    }

    // when player is hit
    playerHit()
    {
        this.player.body.velocity.y = this.JUMP_VELOCITY;
        this.gameOver = true;
        this.loseScreen();
        console.log('game over');
    }

    //adds a meteor
    addMeteor(deltaMultiplier){
        //set to 7 for testing
        this.spawn = Phaser.Math.Between(7, 9) * 100;
        if(Phaser.Math.Between(1,2) == 1){
            let fallingObs = new Meteor(this, this.spawn, this.SCROLL_SPEED*deltaMultiplier, 'carDoor').setOrigin(0.5, 0.5);
            this.meteorGroup.add(fallingObs);
            fallingObs.setInteractive(new Phaser.Geom.Rectangle(0, 0, fallingObs.width,
                fallingObs.height), Phaser.Geom.Rectangle.Contains);
            fallingObs.on('pointerdown', () => {
                fallingObs.destroyObj();
                this.obstaclesDestroyed += 1;
            });
        }
        else{
            let fallingObs = new Meteor(this, this.spawn, this.SCROLL_SPEED*deltaMultiplier, 'tire').setOrigin(0.5, 0.5);
            this.meteorGroup.add(fallingObs);
            fallingObs.setInteractive(new Phaser.Geom.Rectangle(0, 0, fallingObs.width,
                fallingObs.height), Phaser.Geom.Rectangle.Contains);
            fallingObs.on('pointerdown', () => {
                fallingObs.destroyObj();
                this.obstaclesDestroyed += 1;
            });
            fallingObs.wheel = true;
        }

        
    }
    adjustSpeed() {
        if (this.SCROLL_SPEED < 12) {
            console.log("speed increased");
            this.speedMultiplier += 1;
            this.SCROLL_SPEED = this.BASE_SPEED + (0.2 * this.speedMultiplier);
            console.log(this.SCROLL_SPEED);
        }
    }

    
    loseScreen(){
        console.log("obstacles jumped: " + this.obstaclesJumped);
        console.log("obstacles destroyed: " + this.obstaclesDestroyed);
        console.log("distance travelled: " + Math.floor(this.distanceTravelled) + " ft");
        console.log("total times jumped: " + this.timesJumped);
        //change crosshair back to cursor
        this.input.setDefaultCursor('url(assets/crosshair.png), pointer');
        this.lose = this.add.tileSprite(400, 150, 400, 200, 'gameOverCard').setOrigin(0.5, 0.5);
        this.gameOver = true;
        console.log('lose');
        // When player loses, make it so they can return to to the menu by pressing the button.
        //temp until buttons are made
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
        this.return = this.add.text(game.config.width/2, 350, 'MENU',
        menuConfig).setOrigin(0.5, 0.5);
        //set interactive
        this.return.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.return.width,
             this.return.height), Phaser.Geom.Rectangle.Contains);
        this.return.on('pointerdown', () => {
            this.scene.start('menuScene');
        });
        //this.scene.start('menuScene');
    }
}