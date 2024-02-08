import * as THREE from 'three';

export function getRandomNumber(min, max)
{
    return Math.random() * (max - min) + min;
}

export class Background {
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

export class MiddleLine {
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