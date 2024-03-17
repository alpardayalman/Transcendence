import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


async function startGame() {
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Background {
        constructor(x, y, color) {
            this.geometry = new THREE.PlaneGeometry(x, y, 32, 32);
            this.material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
            this.plane = new THREE.Mesh(this.geometry, this.material);
        }

        getPlane() {
            return (this.plane);
        }

        setPos(x, y, z) {
            this.plane.position.x = x;
            this.plane.position.y = y;
            this.plane.position.z = z;
        }
    }

    class MiddleLine {
        constructor(color, boundY) {
            this.geometry = new THREE.BoxGeometry(1, 3, 0.2);
            this.material = new THREE.MeshBasicMaterial({ color: color });
            this.line1 = new THREE.Mesh(this.geometry, this.material);
            this.line2 = new THREE.Mesh(this.geometry, this.material);
            this.line3 = new THREE.Mesh(this.geometry, this.material);
            this.line4 = new THREE.Mesh(this.geometry, this.material);
            this.line5 = new THREE.Mesh(this.geometry, this.material);
            this.line6 = new THREE.Mesh(this.geometry, this.material);
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
        getLine() {
            return ([this.line1, this.line2, this.line3, this.line4, this.line5, this.line6]);
        }
    }

    class InputHandler {
        constructor() {
            this.keyValue = [];
            this.keyOn = [];
        }

        addKey(key) {
            this.keyValue.push(key);
            this.keyOn.push(false);
        }

        eventKeyDown(event) {
            this.keyOn[this.keyValue.indexOf(event.key)] = true;
        }

        eventKeyUp(event) {
            this.keyOn[this.keyValue.indexOf(event.key)] = false;
        }

        isKeyOn(key) {
            return (this.keyOn[this.keyValue.indexOf(key)]);
        }
    }

    class Ball {
        constructor(boundX, boundY, color) {
            this.boundX = boundX / 2;
            this.boundY = boundY / 2;
            this.ballSpeed = 25;
            this.rotat = this.ballSpeed / 16;
            this.geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            this.material = new THREE.MeshBasicMaterial({ color: color });
            this.ball = new THREE.Mesh(this.geometry, this.material);
            this.dir = new THREE.Vector2(
                !(parseInt(getRandomNumber(0, 2))) ? getRandomNumber(-0.8, -0.4) : getRandomNumber(0.4, 0.8),
                !(parseInt(getRandomNumber(0, 2))) ? getRandomNumber(-0.8, -0.4) : getRandomNumber(0.4, 0.8)).normalize();
        }
        ballCollisionPaddle(paddleY) {
            if (this.ball.position.x > 0)
                this.ball.position.x = this.boundX;
            else
                this.ball.position.x = -this.boundX;
            if ((paddleY + 2.5) > this.ball.position.y && (paddleY - 2.5) < this.ball.position.y) {
                this.dir.x = -this.dir.x;
                switch (true) {
                    case (this.ball.position.y < (paddleY + 0.5) && this.ball.position.y > (paddleY - 0.5)):
                        this.dir = new THREE.Vector2(
                            this.dir.x,
                            (this.dir.y < 0) ? getRandomNumber(-0.3, 0) : getRandomNumber(0, 0.3)).normalize();
                        this.rotat = this.ballSpeed / 16;
                        break;
                    case (this.ball.position.y < (paddleY + 1.3) && this.ball.position.y > (paddleY - 1.3)):
                        this.dir = new THREE.Vector2(
                            this.dir.x,
                            (this.dir.y < 0) ? getRandomNumber(-0.7, -0.3) : getRandomNumber(0.3, 0.7)).normalize();
                        this.rotat = this.ballSpeed / 8;
                        break;
                    default:
                        this.dir = new THREE.Vector2(
                            this.dir.x,
                            (this.dir.y < 0) ? getRandomNumber(-0.9, -0.7) : getRandomNumber(0.7, 0.9)).normalize();
                        this.rotat = this.ballSpeed / 4;
                        break;
                }
                return (0);
            }
            this.ballReset();
            return (1);
        }
        ballCollisionY() {
            if (this.ball.position.y >= this.boundY) {
                this.dir.y = -this.dir.y;
                this.ball.position.y = this.boundY;
            }
            else if (this.ball.position.y <= -this.boundY) {
                this.dir.y = -this.dir.y;
                this.ball.position.y = -this.boundY;
            }
        }
        moveBall(deltaTime) {
            this.ball.position.x += deltaTime * this.ballSpeed * this.dir.x;
            this.ball.position.y += deltaTime * this.ballSpeed * this.dir.y;
            this.ball.rotation.x += this.rotat * deltaTime;
            this.ball.rotation.y += this.rotat * deltaTime;
            if (this.ball.rotation.x >= 360 || this.ball.rotation.y >= 360) {
                this.ball.rotation.x = 0;
                this.ball.rotation.y = 0;
            }
        }
        getBall() {
            return (this.ball);
        }
        ballReset() {
            this.ballSpeed = 25;
            this.ball.position.x = 0;
            this.ball.position.y = 0;
            this.dir = new THREE.Vector2(
                !(parseInt(getRandomNumber(0, 2))) ? getRandomNumber(-0.8, -0.4) : getRandomNumber(0.4, 0.8),
                !(parseInt(getRandomNumber(0, 2))) ? getRandomNumber(-0.8, -0.4) : getRandomNumber(0.4, 0.8)).normalize();
            this.rotat = this.ballSpeed / 16;
            this.ball.rotation.x = 0;
            this.ball.rotation.y = 0;
        }
    }

    class Paddle {
        constructor(upKey, downKey) {
            this.geometry = new THREE.BoxGeometry(1.3, 4, 2.5);
            this.material = new THREE.MeshBasicMaterial({ color: 0x96a2b3 });
            this.paddle = new THREE.Mesh(this.geometry, this.material);
            this.paddleSpeed = 35;
            this.upKey = upKey;
            this.downKey = downKey;
        }

        paddleMove(input, deltaTime) {
            if ((input.isKeyOn(this.upKey) || input.isKeyOn(this.upKey.toUpperCase()))&& this.paddle.position.y + 1.5 <= 10)
                this.paddle.position.y += this.paddleSpeed * deltaTime;
            if ((input.isKeyOn(this.downKey) || input.isKeyOn(this.downKey.toUpperCase()))&& this.paddle.position.y - 1.5 >= -10)
                this.paddle.position.y -= this.paddleSpeed * deltaTime;
        }
        getPaddle() {
            return (this.paddle);
        }
    }

    class Wall {
        constructor(boundX, boundY, color) {
            this.geometry = new THREE.BoxGeometry(boundX, 0.8, 4);
            this.material = new THREE.MeshBasicMaterial({ color: color });
            this.topWall = new THREE.Mesh(this.geometry, this.material);
            this.bottomWall = new THREE.Mesh(this.geometry, this.material);
            this.topWall.position.y += (boundY / 2) + 0.4;
            this.bottomWall.position.y -= (boundY / 2) + 0.4;
        }
        getWall() {
            return ([this.bottomWall, this.topWall]);
        }
    }


    const canvas = document.getElementById("pong_canvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ stencil: true, canvas: canvas });
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.setSize(canvas.width, canvas.height);
    document.body.appendChild(renderer.domElement);

    let Time = new THREE.Clock();
    let deltaTime = 0;

    const input = new InputHandler();

    input.addKey("a");
	input.addKey("A");
    input.addKey("s");
	input.addKey("S")
    input.addKey("k");
    input.addKey("K");
    input.addKey("l");
    input.addKey("L");
    input.addKey(" ");
    input.addKey("Escape");

    // Set the position of the canvas

    function resizeCanvas() {
        const height = window.innerHeight - (window.innerHeight / 3);
        const width = window.innerWidth - (window.innerWidth / 3);

        canvas.height = height;
        canvas.width = width;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('keydown', (event) => { input.eventKeyDown(event); });
    window.addEventListener('keyup', (event) => { input.eventKeyUp(event); });
    window.addEventListener('resize', () => {
        resizeCanvas();
    }, false);

    const player1Name = "{{ USERNAME_1 }}";
    const player2Name = "{{ USERNAME_2 }}";

    const boundX = 40;
    const boundY = 20;

    const paddle1 = new Paddle("a", "s");
    const paddle2 = new Paddle("k", "l");

    const gamePlane = new Background(boundX + 1.8, boundY + 2.2, 0x413a42);
    const backPlane = new Background(200, 100, 0x1f1f29);
    const middleLine = new MiddleLine(0xd84a5, boundY);

    const ball = new Ball(boundX, boundY, 0xeaf0d8);
    const walls = new Wall(boundX + 1.8, boundY + 2.2, 0x596070);

    const test = new THREE.Scene();

    function init() {
        camera.position.z = 30;
        scene.add(walls.getWall()[0]);
        scene.add(walls.getWall()[1]);
        scene.add(middleLine.getLine()[0]);
        scene.add(middleLine.getLine()[1]);
        scene.add(middleLine.getLine()[2]);
        scene.add(middleLine.getLine()[3]);
        scene.add(middleLine.getLine()[4]);
        scene.add(middleLine.getLine()[5]);
        gamePlane.setPos(0, 0, 0);
        backPlane.setPos(0, 0, -10);
        test.add(gamePlane.getPlane());
        scene.add(gamePlane.getPlane());
        scene.add(backPlane.getPlane());
        paddle1.getPaddle().position.x = boundX / -2 - 1;
        paddle2.getPaddle().position.x = boundX / 2 + 1;
        scene.add(paddle1.getPaddle());
        scene.add(paddle2.getPaddle());
        ball.getBall().position.z = 1;
        scene.add(ball.getBall());
    }

    async function matchOver(matData)
    {
        const head = new Headers();
        head.append('Content-Type', 'application/json');
        head.append('Authorization', getCookie('access_token'));
        await fetch(window.location.origin + '/api/match/', {
            method: "POST",
            headers: head,
            body: matData,
        })
        .then(response => response.json())
        .then(data => {
        })

    }

    let player1Score = 0;
    let player2Score = 0;

    const score = document.getElementById("scoreText");
    score.innerText = "PRESS SPACE TO START THE MATCH";

    let matchData;

    let animationFrame;
    let sceneManager = 1;
    let gameStart = 0;

	let SPACE = "  ";

    let escIsDown = false;

    function animate() {
        if (isRunning)
            animationFrame = requestAnimationFrame(animate);
        else {
            cancelAnimationFrame(animationFrame);
            canvas.parentElement.removeChild(canvas);
            return (0);
        }
        deltaTime = Time.getDelta();
        switch (sceneManager) {
            case 1:
                if (input.isKeyOn(' ')) {
                    score.innerText = `${player1Score} - ${player1Name} VS ${player2Name} - ${player2Score}`;
                    gameStart = 1;
                }
                if (input.isKeyOn('Escape')) {
                    escIsDown = true;
                }

                if (escIsDown && !input.isKeyOn('Escape')) {
                    score.innerText = `GAME IS PAUSED!!!`;
                    sceneManager = 3;
                    escIsDown = false;
                }

                if (ball.getBall().position.x >= boundX / 2) {
                    ball.ballSpeed += 1.33;
                    player1Score += ball.ballCollisionPaddle(paddle2.getPaddle().position.y);
                    score.innerText = `${player1Score} - ${player1Name} VS ${player2Name} - ${player2Score}`
                }
                else if (ball.getBall().position.x <= -boundX / 2) {
                    ball.ballSpeed += 1.33;
                    player2Score += ball.ballCollisionPaddle(paddle1.getPaddle().position.y);
                    score.innerText = `${player1Score} - ${player1Name} VS ${player2Name} - ${player2Score}`
                }
                if (player1Score == 3 || player2Score == 3) {
                    if (player1Score > player2Score)
						score.innerText = `Victory: ${player1Name} Score: ${player1Score} - ${player2Score}`
                    else
						score.innerText = `Victory: ${player2Name} Score: ${player2Score} - ${player1Score}`
                    matchData = JSON.stringify({
                        UserOne: player1Name,
                        UserTwo: player2Name,
                        ScoreOne: player1Score,
                        ScoreTwo: player2Score,
                    })
                    sceneManager = 2;
                }

                ball.ballCollisionY();
                if (gameStart == 1)
                    ball.moveBall(deltaTime);

                paddle1.paddleMove(input, deltaTime);
                paddle2.paddleMove(input, deltaTime);

                controls.update();
                renderer.render(scene, camera);
            break;
            case 2:
                ball.ballSpeed = 38;
                if (input.isKeyOn(' ')) {
                    matchOver(matchData);
                    cancelAnimationFrame(animationFrame);
                    canvas.parentElement.removeChild(canvas);
                    replacePage('/pong');
                    return (0);
                }
                if (ball.getBall().position.x >= boundX / 2) {
                    ball.ballCollisionPaddle(paddle2.getPaddle().position.y);
                }
                else if (ball.getBall().position.x <= -boundX / 2) {
                    ball.ballCollisionPaddle(paddle1.getPaddle().position.y);
                }
                paddle1.paddle.position.y = ball.ball.position.y;
                paddle2.paddle.position.y = ball.ball.position.y;
                ball.ballCollisionY();
                ball.moveBall(deltaTime);

                controls.update();
                renderer.render(scene, camera);
            break;
            case 3:
                if (input.isKeyOn('Escape')) {
                    escIsDown = true;
                }

                if (escIsDown && !input.isKeyOn('Escape')) {
                    score.innerText = `${player1Name}: ${player1Score}    ${player2Name}: ${player2Score}`;
                    sceneManager = 1;
                    escIsDown = false;
                }

                controls.update();
                renderer.render(scene, camera);
            break ;
        }

    }


    function main() {
        init();
        resizeCanvas();
        animate();
    }

    main();
}

startGame();