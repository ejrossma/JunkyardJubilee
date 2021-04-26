class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
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

        // variables and settings
        this.JUMP_VELOCITY = -700;              // lower -> cant jump as high, higher -> can jump higher
        this.MAX_JUMPS = 1;                     // amount of jumps the player can do (default to 1)
        this.SCROLL_SPEED = 2;                  // how fast the tiles are moving below
        this.physics.world.gravity.y = 2600;    // this was default physics, I changed it to higher and it didnt work, so idk if we can change
        this.whichObstacle = Phaser.Math.Between(1, 1);     // choose obstacle
        this.obstacleDeployed = false;                      // bool that controls when obstacles spawn
        this.gameOver = false;                              // game over boolean
        this.OBSTACLE_SPEED = -280;                         // speed that the jumping obstacles move

        // create the ground tiles using the ground.png that covers the bottom of game screen (default tileSize = 16 which can be changed later)
        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i+= tileSize) 
        {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // ground scroll variable
        this.groundScroll = this.add.tileSprite(0,game.config.height-tileSize, game.config.width, tileSize, 'ground').setOrigin(0);

        // create the player (x, y, image)
        this.player = this.physics.add.sprite(100, game.config.height - tileSize*2, 'player').setScale(SCALE);

        // cursor key input (aka keyboard keys which are written in lowercase)
        cursors = this.input.keyboard.createCursorKeys();

        // physics collider (makes so the player can't pass through ground)
        this.physics.add.collider(this.player, this.ground);
    }

    update() {
        // update tiles (aka the ground scrolls)
        this.groundScroll.tilePositionX += this.SCROLL_SPEED;

        // check if player is on the ground
        this.player.isGrounded = this.player.body.touching.down;
        // if grounded, allow them to jump
        if (this.player.isGrounded)
        {
            //this.player.anims.play();  // placeholder walk animation spot
            this.jumps = this.MAX_JUMPS;
            this.jumping = false
        }
        else
        {
            //this.player.anims.play();   // placeholder jump animation
        }

        // detect how long the user presses the space(jump) key and jump accordingly
        if (this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.space, 150)) 
        {
            this.player.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
        }

        // when key is let go of, allow for player to jump again
        if (this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.space))
        {
            this.jumps--;
            this.jumping = false;
        }

        // deploy the obstacles in the game **conditions: game is not over && an object is not deployed (a buffer boolean)**
        if (!this.gameOver && this.obstacleDeployed == false)
        {
            this.obstacleDeployed = true;                           // set to true to prevent more than one spawning at a time
            this.whichObstacle = Phaser.Math.Between(1,1);          // randomly select obstacle (1 at the moment)
            this.clock = this.time.delayedCall(4000, () => {        // spawn an obstacle after a delayed call
                console.log("Obstacle Deployed");
                // check which obstacle is being spawned
                if (this.whichObstacle == 1)
                {
                    // for this particular obstacle there is 2 variations so spawn whichever is randomly generated
                    this.whichJumpObstacle = Phaser.Math.Between(1, 2);
                    if (this.whichJumpObstacle == 1)
                    {
                        // obstacle that is 128 x 64
                        this.jumpObstacle = this.physics.add.sprite(game.config.width + tileSize, game.config.height - tileSize*1.5, 'testCar').setScale(1);    // spawn sprite
                        this.jumpObstacle.body.allowGravity = false;            // disable gravity
                        this.jumpObstacleDeployed = true;                       // tell which obstacle is deployed (for checking later)
                    }
                    else if (this.whichJumpObstacle == 2)
                    {
                        // obstacle that is 64 x 64
                        this.jumpObstacle = this.physics.add.sprite(game.config.width + tileSize, game.config.height - tileSize*1.5, 'testBox').setScale(1);    // spawn sprite
                        this.jumpObstacle.body.allowGravity = false;            // disable gravity
                        this.jumpObstacleDeployed = true;                       // tell which obstacle is deployed (for checking later)
                    }
                    this.obstacleDeployed = false;       // allow for new obstacle to be deployed
                }
            }, null, this);
        }
 
        // jump obstacle checking
        if (!this.gameOver && this.jumpObstacleDeployed == true)
        {
            this.jumpObstacle.x -= this.SCROLL_SPEED;   // move the jump obstacle towards player
 
            // if obstacle reaches the end of the screen, destroy it.
            if (this.jumpObstacle.x <= 0 - this.jumpObstacle.width) {
                this.jumpObstacle.destroy();        // destroy object
                console.log('Object Destroyed');    // debugging
                this.jumpObstacleDeployed = false;  // reset boolean
            }
 
            // check for collision with player
            if (this.checkCollision(this.jumpObstacle, this.player))
            {
                console.log('game over');           // would set game over boolean to true
            }
        }
    }

    // collison for obstacles and player
    checkCollision(obstacle, player)
    {
        // AABB checking that works for jumping obstacles
        if (player.x < obstacle.x + obstacle.width/2 && player.x + player.width/2 > obstacle.x && player.y < obstacle.y + obstacle.height && player.height + player.y > obstacle.y)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}