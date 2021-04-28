class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, velocity, texture){
        super(scene, x, 0, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.speed = velocity;
        this.fall = -velocity / 1.5
        this.grounded = false;
        console.log("made a meteor");
    }

    update(){
        if(this.grounded == false){
            this.body.velocity.x = this.fall;
            this.body.velocity.y = this.speed;
            this.body.angularVelocity = 250;
            if(this.y > 350){
                console.log("dropped");
                this.grounded = true;
                this.body.angularVelocity = 0;
            }
        }
        if(this.grounded == true){
            this.x -= this.scene.SCROLL_SPEED*2;
        }
        if(this.x < -50){
            this.scene.jumpObstacleDeployed = false;  // reset boolean
            this.scene.obstacleDeployed = false;
            this.destroy();
        }

    }
}