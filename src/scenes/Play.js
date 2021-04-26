class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // variables and settings
        this.JUMP_VELOCITY = -500;              // lower -> cant jump as high, higher -> can jump higher
        this.MAX_JUMPS = 1;                     // amount of jumps the player can do (default to 1)
        this.SCROLL_SPEED = 2;                  // how fast the tiles are moving below
        this.physics.world.gravity.y = 2600;    // this was default physics, I changed it to higher and it didnt work, so idk if we can change

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
        this.player = this.physics.add.sprite(100, game.config.height - tileSize*2 - playerPadding, 'player').setScale(SCALE);

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
    }
}