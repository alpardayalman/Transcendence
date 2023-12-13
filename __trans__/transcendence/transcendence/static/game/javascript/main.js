import * as t from './test.js';

console.log("HELLO");

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 3, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );

const geometry2 = new THREE.OctahedronGeometry( 2, 1);
const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const octahedron = new THREE.Mesh( geometry2, material2 );

scene.add( cube );
scene.add( octahedron );

octahedron.position.y = 5;

camera.position.z = 10;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	octahedron.rotation.x += 0.01;
	octahedron.rotation.y += 0.01;


	renderer.render( scene, camera );
}

animate();