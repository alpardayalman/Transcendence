import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import * as PongInput from './InputHandler.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.getElementById("pong_canvas");
const renderer = new THREE.WebGLRenderer({stencil: true, canvas: canvas});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );


document.body.appendChild( renderer.domElement );

const geometry1 = new THREE.BoxGeometry( 1, 1, 1);
const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00} );

const geometry = new THREE.BoxGeometry( 0.8, 4, 5);
const material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
const cube1 = new THREE.Mesh( geometry, material );

const icoGeo = new THREE.IcosahedronGeometry(0.6, 0);
const icoMat = new THREE.MeshBasicMaterial( {color: 0xff0000} );

const ico = new THREE.Mesh( geometry1, material1 );
ico.castShadow = true;

const planeGeo = new THREE.PlaneGeometry( 21.8, 11.2, 30, 30);
const planeMat = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
scene.add( plane );

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.castShadow = true;
light.position.set( 0, 10, 4 );
light.rotation.y = 240;
const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( ico );



scene.add( light );
scene.add( helper );

// scene.add( capsule );
scene.add( cube1 );

camera.position.z = 20;

camera.position.x = 0;


function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight, true);
}

window.addEventListener('resize', onWindowResize, false);

let Time = new THREE.Clock();
let deltaTime = 0;

// let input = PongInput.PongInput();

let wKey = 'w';
let sKey = 's';

let wDown = false;
let sDown = false;

window.addEventListener('keydown', (event) => {
	if (wKey === event.key)
		wDown = true;
	if (sKey === event.key)
		sDown = true;
});

window.addEventListener('keyup', (event) =>  {
	if (wKey === event.key)
		wDown = false;
	if (sKey === event.key)
		sDown = false;
});

function handleInput()
{
	if (wDown)
		console.log("W DOWN");
	if (sDown)
		console.log("S DOWN");
}



const ballDir = new THREE.Vector2( 0.1, 0.1 );
let ballSpeed =  150;

const paddleSpeed = 20;

function movePaddle()
{
	if (wDown && cube1.position.y + 1.5 <= 5)
		cube1.position.y += paddleSpeed * deltaTime;
	if (sDown && cube1.position.y - 1.5 >= -5)
		cube1.position.y -= paddleSpeed * deltaTime;
}

let xChangeRight = true;
let xChangeLeft = true;
let yChangeTop = true;
let yChangeBottom = true;

ico.position.z = 1;
// ico.position.y = 5;
cube1.position.z = 0;
cube1.position.x = -11;

// line.position.z = ico.position.z;

camera.lookAt(ico);

let rotat = 0.01;

function animate()
{
	requestAnimationFrame( animate ); 
	deltaTime = Time.getDelta();

	if (ico.position.x >= 10 && xChangeRight)
	{
		ballDir.x = -ballDir.x;
		ico.position.x = 10;
		console.log("X CHANGED  " + "X => " + ico.position.x);
		console.log("");
		xChangeRight = false;
		xChangeLeft = true;
	}
	if (ico.position.x <= -10 && xChangeLeft)
	{
		xChangeRight = true;
		xChangeLeft = false;
		if ((cube1.position.y + 2) > ico.position.y && (cube1.position.y - 2) < ico.position.y)
		{
			ballDir.x = -ballDir.x;
			ico.position.x = -10;
			rotat += 0.02;
		}
		else
		{
			ico.position.y = 0;
			ico.position.x = 0;
			xChangeLeft = true;
		}

	}

	if (ico.position.y >= 5 && yChangeTop)
	{
		// if ((cube1.position.y + 1.5) > ico.position.y && (cube1.position.y - 1.5) < ico.position.y)
		// {
			ballDir.y = -ballDir.y;
			ico.position.y = 5;
		// }
		console.log("Y CHANGED  " + "Y => " + ico.position.y);
		console.log("");
		yChangeTop = false;
		yChangeBottom = true;
	}
	if (ico.position.y <= -5 && yChangeBottom)
	{
		ballDir.y = -ballDir.y;
		ico.position.y = -5;
		console.log("Y CHANGED  " + "Y => " + ico.position.y);
		console.log("");
		yChangeTop = true;
		yChangeBottom = false;
	}
	ico.position.x += ballSpeed * deltaTime * ballDir.x;
	ico.position.y += ballSpeed * deltaTime * ballDir.y;

	handleInput();
	movePaddle();

	ico.rotation.x += rotat;
	ico.rotation.y += rotat;
	
	// line.position.x = ico.position.x;
	// line.position.y = ico.position.y;

	controls.update();
	renderer.render( scene, camera );w
	// ballSpeed += 1;
	//->
}

function main()
{
	animate();
}

main();