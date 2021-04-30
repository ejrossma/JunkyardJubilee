class jumpObstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.body.allowGravity = false;            // disable gravity
        this.immovable = true;
        this.locationChecked = false;
    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667);
        this.x -= this.scene.SCROLL_SPEED*deltaMultiplier;

        // check whether anothe jump obstacle can be spawned
        if (this.locationChecked == false)
        {
            if (this.x <= game.config.width/1.25)
            {
                //console.log('jump obstacle allowed');
                this.locationChecked = true;
                this.scene.JUMP_OBS_ALLOWED = true;
            }
        }
        
        // destroy object when off screen
        if(this.x <= 0 - this.width) 
        {
            this.scene.obstaclesJumped += 1;
            this.destroyObj();
        }
    }

    destroyObj()
    {
        this.scene.CURRENT_OBSTACLES_AMT--;
        this.destroy();
    }
}