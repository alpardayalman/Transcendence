import * as Utility from "./GameUtility.js";
import * as THREE from 'three';

export default class Ball {
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
            Utility.getRandomNumber(-0.9, 0.9),
            Utility.getRandomNumber(-0.9, 0.9)).normalize();
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
                        (this.dir.y < 0) ? Utility.getRandomNumber(-0.3, 0) : Utility.getRandomNumber(0, 0.3)).normalize();
                    this.rotat = 6;
                    break;
                case (this.ball.position.y < (paddleY + 1.3) && this.ball.position.y > (paddleY - 1.3)):
                    this.dir = new THREE.Vector2(
                        this.dir.x,
                        (this.dir.y < 0) ? Utility.getRandomNumber(-0.7, -0.3) : Utility.getRandomNumber(0.3, 0.7)).normalize();
                    this.rotat = 12;
                    break;
                default:
                    this.dir = new THREE.Vector2(
                        this.dir.x,
                        (this.dir.y < 0) ? Utility.getRandomNumber(-0.9, -0.7) : Utility.getRandomNumber(0.7, 0.9)).normalize();
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
            Utility.getRandomNumber(-0.9, 0.9),
            Utility.getRandomNumber(-0.9, 0.9)).normalize();
        this.rotat = 0;
        this.ball.rotation.x = 0;
        this.ball.rotation.y = 0;
    }
}