class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, velocity, texture){
        super(scene, x, 0, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.speed = velocity;
        this.fallFrom = x;
        this.reachedBottom = false;
        console.log("made a meteor");
    }

    update(){
        this.body.velocity.x = -this.speed / 1.5;
        this.body.velocity.y = this.speed;
        this.body.angularVelocity = 200;
        if(!this.reachedBottom && this.y > 480){
            this.reachedBottom = true;
            //this.scene.addMeteor(this.parent, this.x, this.velocity, this.texture);
            console.log('Object Destroyed');    // debugging
            this.scene.jumpObstacleDeployed = false;  // reset boolean
            this.scene.obstacleDeployed = false;
            this.destroy();
        }
    }
}