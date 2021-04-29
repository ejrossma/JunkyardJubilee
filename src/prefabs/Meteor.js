class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, velocity, texture){
        super(scene, x, 0, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.speed = velocity;
        this.fall = -velocity / 1.5
        this.grounded = false;
        this.randomSpin = Phaser.Math.Between(10, 25) * 10;
        console.log("made a meteor");
    }

    update(){
        if(this.grounded == false){
            this.body.velocity.x = this.fall;
            this.body.velocity.y = this.speed;
            this.body.angularVelocity = this.randomSpin;
            if(this.y > 350){
                console.log("dropped");
                this.grounded = true;
                this.body.angularVelocity = 0;
            }
        }
        if(this.grounded == true){
            this.x -= this.scene.SCROLL_SPEED/1.5;
        }
        if(this.x < -50){
            this.destroyObj();
        }

    }
    destroyObj(){
        this.scene.obstacleDeployed = false;
        this.destroy();
    }
}