import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

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
		console.log("Player 1 Score = " + player1Score);
	}
	else if (ball.getBall().position.x <= -boundX / 2)
	{
		player2Score += ball.ballCollisionPaddle(paddle1.getPaddle().position.y);
		console.log("Player 2 Score = " + player2Score);
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

// main();