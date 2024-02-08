import * as THREE from 'three';

export default class Paddle {
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