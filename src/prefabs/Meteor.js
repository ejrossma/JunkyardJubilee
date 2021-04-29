class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, velocity, texture){
        super(scene, x, 0, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.speed = velocity + 350;
        this.fall = -velocity - 150;
        this.grounded = false;
        this.randomSpin = Phaser.Math.Between(10, 25) * 10;
        this.wheel = false;
        console.log("made a meteor");
    }

    update(time, delta){
        let deltaMultiplier = (delta/16.66667);
        if(this.grounded == false){
            this.body.velocity.x = this.fall*deltaMultiplier;
            this.body.velocity.y = this.speed*deltaMultiplier;
            if(this.wheel == true){  
                this.body.angularVelocity = this.randomSpin;
            }
            if(this.y > 370){
                console.log("dropped");
                this.grounded = true;
            }
        }
        if(this.grounded == true){
            this.x -= this.scene.SCROLL_SPEED*deltaMultiplier;
        }
        if(this.x < -50){
            this.scene.obstaclesJumped += 1;
            this.destroyObj();
        }

    }
    destroyObj(){
        this.scene.obstacleDeployed = false;
        this.destroy();
    }
}