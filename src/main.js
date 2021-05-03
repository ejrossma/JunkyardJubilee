/*-------------------------------------------------
Names:  Elijah Rossman, Kristopher Yu, Kevin Lewis
Title:  Junkyard Jubilee
Class:  CMPM-120
Completion Date:    5/3/2021

--------------------
Creative Tilt
--------------------
A technically interesting part of our endless runner is that there are two distinct and different
mechanics when it comes to dodging incoming obstacles. First, there are the obstacles attached to the
ground that the player must jump over while the player endlessly runs along the ground. Second, there
are meteors that can be shot down mid-air or jumped over if they hit the ground and begin to go towards
the player. In our endless runner, we utilize these two types of obstacles in order to create two seperate controls,
one using the spacekey and one using the mouse to point and click. With both these mechanics in place, it makes the
game interesting as you have to use both hands and have to pay attention to multiple things at once as the game gets
increasingly harder and faster.

Something that I (Kevin), in particular am proud of is the generation of randomized objects and how they increase over time.
I have never used Phaser/Javascript or VS Code before, so it took a little bit of time to get the hang of the syntax that are
used for these projects, but I feel that the randomly generated obstacles was the most rewarding in the end. It initially started
with when one of the obstacles was destroyed, a new one would spawn, but we decided that adding multiple would increase the difficulty
and enjoyment, so I countlessly tested and re-tested ways to spawn two at a time, and then increase to more and more over the course of
the game. One particular part that took a bit of time to fix was the ground objects spawning too close or inside of each other, making it
an instant loss in some cases, so I had to create a boolean inside the prefab in order to make the ground objects unable to spawn within a
certain distance of each other. The addObstacle(), addJumpObstacle(), and addMeteor() functions in the Play.js as well as lines 206-212 in
the Play.js show how we were able to make and create those objects as well as the prefabs for those objects. Lines 227-259 show how we updated
the amount of objects spawned based on the current speed of the game.

-------------------------------------------------*/

//game configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    scene: [ Menu, Play, ],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // turn true to enable the collision borders/barriers
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
}

let game = new Phaser.Game(config);

// global variables
let borderSize = game.config.height / 15;
let playerPadding = borderSize / 3;
let cursors;
// global speed variable
let SPEED_MULTIPLIER;
let GAME_SPEED;
let MAX_SPEED;
//High score
let topScore = 0;
const SCALE = 0.5;
const tileSize = 64;