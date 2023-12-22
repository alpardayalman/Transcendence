import * as THREE from 'three';
import * as Utility from "./GameUtility.js";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import InputHandler from "./InputHandle.js";
import Ball from "./Ball.js";
import Paddle from "./Paddle.js";


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

const gamePlane = new Utility.Background(boundX + 1.8, boundY + 2.2, 0xffff00);
const backPlane = new Utility.Background(200, 100, 0x99ffff);
const middleLine = new Utility.MiddleLine(0x000000, boundY);

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

main();