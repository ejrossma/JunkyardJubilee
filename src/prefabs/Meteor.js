class Meteor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, velocity, texture){
        super(scene, x, 0, texture);
        scene.add.existing(this);               //add to scene
        scene.physics.add.existing(this);       //add to physics
        this.speed = velocity;
        this.fall = -velocity / 1.5
        this.fallFrom = x;
        console.log("made a meteor");
    }

    update(){
        this.body.velocity.x = this.fall;
        this.body.velocity.y = this.speed;
        this.body.angularVelocity = 200;
        if(this.x < 0){
            this.destroy();
            this.scene.jumpObstacleDeployed = false;  // reset boolean
            this.scene.obstacleDeployed = false;
        }
    }
}