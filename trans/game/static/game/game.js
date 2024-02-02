// import * as THREE from 'three';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// SOCKET
const loc = window.location;

let wsStart;
if (loc.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

let endpoint = wsStart + loc.host + loc.pathname;
let socket = new WebSocket(endpoint);

socket.onopen = function(e) {
    console.log('onopen', e.data);
}

socket.onmessage = function(e) {
    console.log('onmessage', e.data);
    const data = e.data;
    if (data.action === 'game_request') {
        console.log('game_request');
    }
}

// GAME

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};


var isRunning = true;
var canvas = document.createElement("canvas");
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var keysDown = {};

var render = function () {
context.fillStyle = "#FF00FF";
context.fillRect(0, 0, width, height);
player.render();
computer.render();
ball.render();
};

var update = function () {
player.update();
computer.update(ball);
ball.update(player.paddle, computer.paddle);
};

var step = function () {
update();
render();
if (isRunning)
    animate(step);
};

function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.x_speed = 0;
this.y_speed = 0;
}

Paddle.prototype.render = function () {
context.fillStyle = "#0000FF";
context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
this.x += x;
this.y += y;
this.x_speed = x;
this.y_speed = y;
if (this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
} else if (this.x + this.width > 400) {
    this.x = 400 - this.width;
    this.x_speed = 0;
}
};

function Computer() {
this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function () {
this.paddle.render();
};

Computer.prototype.update = function (ball) {
var x_pos = ball.x;
var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
if (diff < 0 && diff < -4) {
    diff = -5;
} else if (diff > 0 && diff > 4) {
    diff = 5;
}
this.paddle.move(diff, 0);
if (this.paddle.x < 0) {
    this.paddle.x = 0;
} else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
}
};

function Player() {
this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function () {
this.paddle.render();
};

Player.prototype.update = function () {
for (var key in keysDown) {
    var value = Number(key);
    if (value == 37) {
        this.paddle.move(-4, 0);
    } else if (value == 39) {
        this.paddle.move(4, 0);
    } else {
        this.paddle.move(0, 0);
    }
}
};

function Ball(x, y) {
this.x = x;
this.y = y;
this.x_speed = 0;
this.y_speed = 3;
}

Ball.prototype.render = function () {
context.beginPath();
context.arc(this.x, this.y, 5, 2 * Math.PI, false);
context.fillStyle = "#000000";
context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
this.x += this.x_speed;
this.y += this.y_speed;
var top_x = this.x - 5;
var top_y = this.y - 5;
var bottom_x = this.x + 5;
var bottom_y = this.y + 5;

if (this.x - 5 < 0) {
    this.x = 5;
    this.x_speed = -this.x_speed;
} else if (this.x + 5 > 400) {
    this.x = 395;
    this.x_speed = -this.x_speed;
}

if (this.y < 0 || this.y > 600) {
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
}

if (top_y > 300) {
    if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
        this.y_speed = -3;
        this.x_speed += (paddle1.x_speed / 2);
        this.y += this.y_speed;
        // console.log("hit");
    }
} else {
    if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
        this.y_speed = 3;
        this.x_speed += (paddle2.x_speed / 2);
        this.y += this.y_speed;
    }
}
};

document.body.appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
delete keysDown[event.keyCode];
});

function gameUnload() {
    console.log("Unloading the game from game.js");
    // Stop the animation loop
    isRunning = false;
    clearInterval(animate);
    clearInterval(step);
    clearTimeout(animate);
    clearTimeout(step);
    cancelAnimationFrame(animate);
    cancelAnimationFrame(step);
    canvas.remove();
    // Reset game-specific variables or perform any necessary cleanup
    ball.x = 200;
    ball.y = 300;
    ball.x_speed = 0;
    ball.y_speed = 3;

}

/* const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

let isRunning = true;

function animate() {
    if (!isRunning)
        return ;
	requestAnimationFrame( animate );
    console.log("HELLo");
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

function gameUnload() {
    isRunning = false;
    renderer.domElement.parentNode.removeChild(renderer.domElement);
    clearInterval(animate);
    clearTimeout(animate);
    cancelAnimationFrame(animate);
}

animate();

function getRandomNumber(min, max)
{
    return Math.random() * (max - min) + min;
}

class Background {
    constructor(x, y, color)
    {
        this.geometry = new THREE.PlaneGeometry( x, y, 32, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( this.geometry, this.material );
    }

    getPlane()
    {
        return(this.plane);
    }

    setPos(x, y, z)
    {
        this.plane.position.x = x;
        this.plane.position.y = y;
        this.plane.position.z = z;
    }
}

class MiddleLine {
    constructor(color, boundY)
    {
        this.geometry = new THREE.BoxGeometry( 1, 3, 0.2 );
        this.material = new THREE.MeshBasicMaterial( {color: color} );
        this.line1 = new THREE.Mesh( this.geometry, this.material );
        this.line2 = new THREE.Mesh( this.geometry, this.material );
        this.line3 = new THREE.Mesh( this.geometry, this.material );
        this.line4 = new THREE.Mesh( this.geometry, this.material );
        this.line5 = new THREE.Mesh( this.geometry, this.material );
        this.line6 = new THREE.Mesh( this.geometry, this.material );
        this.line1.position.y = boundY / 2;
        this.line2.position.y = boundY / 2 - 4;
        this.line3.position.y = boundY / 2 - 8;
        this.line4.position.y = boundY / 2 - 12;
        this.line5.position.y = boundY / 2 - 16;
        this.line6.position.y = -boundY / 2;
        this.line1.position.z = 0.2;
        this.line2.position.z = 0.2;
        this.line3.position.z = 0.2;
        this.line4.position.z = 0.2;
        this.line5.position.z = 0.2;
        this.line6.position.z = 0.2;
    }
    getLine()
    {
        return([this.line1, this.line2, this.line3, this.line4, this.line5, this.line6]);
    }
}

class InputHandler {
    constructor()
    {
        this.keyValue = [];
        this.keyOn = [];
    }

    addKey(key)
    {
        this.keyValue.push(key);
        this.keyOn.push(false);
    }

    eventKeyDown(event)
    {
        this.keyOn[this.keyValue.indexOf(event.key)] = true;
    }

    eventKeyUp(event)
    {
        this.keyOn[this.keyValue.indexOf(event.key)] = false;
    }

    isKeyOn(key)
    {
        return(this.keyOn[this.keyValue.indexOf(key)]);
    }
}

class Ball {
    constructor(boundX, boundY)
    {
        this.boundX = boundX / 2;
        this.boundY = boundY / 2;
        this.rotat = 0;
        this.ballSpeed = 25;
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.ball = new THREE.Mesh( this.geometry, this.material );
        this.dir = new THREE.Vector2( 
            getRandomNumber(-0.9, 0.9),
            getRandomNumber(-0.9, 0.9)).normalize();
    }
    ballCollisionPaddle(paddleY)
    {
        if (this.ball.position.x > 0)
            this.ball.position.x = this.boundX;
        else
            this.ball.position.x = -this.boundX;
        if ((paddleY + 2) > this.ball.position.y && (paddleY - 2) < this.ball.position.y)
        {
            this.dir.x = -this.dir.x;
            switch (true)
            {
                case (this.ball.position.y < (paddleY + 0.5) && this.ball.position.y > (paddleY - 0.5)):
                    this.dir = new THREE.Vector2(
                        this.dir.x,
                        (this.dir.y < 0) ? getRandomNumber(-0.3, 0) : getRandomNumber(0, 0.3)).normalize();
                    this.rotat = 6;
                    break;
                case (this.ball.position.y < (paddleY + 1.3) && this.ball.position.y > (paddleY - 1.3)):
                    this.dir = new THREE.Vector2(
                        this.dir.x,
                        (this.dir.y < 0) ? getRandomNumber(-0.7, -0.3) : getRandomNumber(0.3, 0.7)).normalize();
                    this.rotat = 12;
                    break;
                default:
                    this.dir = new THREE.Vector2(
                        this.dir.x,
                        (this.dir.y < 0) ? getRandomNumber(-0.9, -0.7) : getRandomNumber(0.7, 0.9)).normalize();
                    this.rotat = 18;
                    break;
            }
            return (0);
        }
        this.ballReset();
        return (1);
    }
    ballCollisionY()
    {
        if (this.ball.position.y >= this.boundY)
        {
            this.dir.y = -this.dir.y;
            this.ball.position.y = this.boundY;
        }
        else if (this.ball.position.y <= -this.boundY)
        {
            this.dir.y = -this.dir.y;
            this.ball.position.y = -this.boundY;
        }
    }
    moveBall(deltaTime)
    {
        this.ball.position.x += deltaTime * this.ballSpeed * this.dir.x;
        this.ball.position.y += deltaTime * this.ballSpeed * this.dir.y;
        this.ball.rotation.x += this.rotat * deltaTime;
        this.ball.rotation.y += this.rotat * deltaTime;
        if (this.ball.rotation.x >= 360 || this.ball.rotation.y >= 360)
        {
            this.ball.rotation.x = 0;
            this.ball.rotation.y = 0;
        }
    }
    getBall()
    {
        return(this.ball);
    }
    ballReset()
    {
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.dir = new THREE.Vector2( 
            getRandomNumber(-0.9, 0.9),
            getRandomNumber(-0.9, 0.9)).normalize();
        this.rotat = 0;
        this.ball.rotation.x = 0;
        this.ball.rotation.y = 0;
    }
}

class Paddle {
    constructor(upKey, downKey)
    {
        this.geometry = new THREE.BoxGeometry( 0.8, 4, 7);
        this.material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
        this.paddle = new THREE.Mesh( this.geometry, this.material );
        this.paddleSpeed = 30;
        this.upKey = upKey;
        this.downKey = downKey;
    }

    paddleMove(input, deltaTime)
    {
        if (input.isKeyOn(this.upKey) && this.paddle.position.y + 1.5 <= 10)
            this.paddle.position.y += 30 * deltaTime;
        if (input.isKeyOn(this.downKey) && this.paddle.position.y - 1.5 >= -10)
            this.paddle.position.y -= 30 * deltaTime;
    }
    getPaddle()
    {
        return(this.paddle);
    }
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const canvas = document.getElementById("pong_canvas");
const renderer = new THREE.WebGLRenderer( {stencil: true, canvas: canvas} );
const controls = new OrbitControls( camera, renderer.domElement );

renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let Time = new THREE.Clock();
let deltaTime = 0;

const input = new InputHandler();

input.addKey("w");
input.addKey("s");
input.addKey("o");
input.addKey("l");

window.addEventListener('keydown', (event) => { input.eventKeyDown(event); });
window.addEventListener('keyup', (event) =>  { input.eventKeyUp(event); });
window.addEventListener('resize', () =>
{
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight, true);
}, false);


const boundX = 40;
const boundY = 20;

const paddle1 = new Paddle("w", "s");
const paddle2 = new Paddle("o", "l");

const gamePlane = new Background(boundX + 1.8, boundY + 2.2, 0x7338A0);
const backPlane = new Background(200, 100, 0x99ffff ^ 0x7338A0);
const middleLine = new MiddleLine(0x000000, boundY);

const ball = new Ball(boundX, boundY);

let player1Score = 0;
let player2Score = 0;

function init()
{
	camera.position.z = 20;
	scene.add( middleLine.getLine()[0] );
	scene.add( middleLine.getLine()[1] );
	scene.add( middleLine.getLine()[2] );
	scene.add( middleLine.getLine()[3] );
	scene.add( middleLine.getLine()[4] );
	scene.add( middleLine.getLine()[5] );
	gamePlane.setPos(0, 0, 0);
	backPlane.setPos(0, 0, -10);
	scene.add( gamePlane.getPlane() );
	scene.add( backPlane.getPlane() );
	paddle1.getPaddle().position.x = boundX / -2 - 1;
	paddle2.getPaddle().position.x = boundX / 2 + 1;
	scene.add( paddle1.getPaddle() );
	scene.add( paddle2.getPaddle() );
	ball.getBall().position.z = 1;
	scene.add( ball.getBall() );
}

function animate()
{
	requestAnimationFrame( animate ); 
	deltaTime = Time.getDelta();

	if (ball.getBall().position.x >= boundX / 2)
	{
		player1Score += ball.ballCollisionPaddle(paddle2.getPaddle().position.y);
		// console.log("Player 1 Score = " + player1Score);
	}
	else if (ball.getBall().position.x <= -boundX / 2)
	{
		player2Score += ball.ballCollisionPaddle(paddle1.getPaddle().position.y);
		// console.log("Player 2 Score = " + player2Score);
	}


	ball.ballCollisionY();
	ball.moveBall(deltaTime);

	paddle1.paddleMove(input, deltaTime);
	paddle2.paddleMove(input, deltaTime);
	
	controls.update();
	renderer.render( scene, camera );
}


function main()
{
	init();
	animate();
}

main(); */