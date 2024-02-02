//game.js

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
    
    // Reset game-specific variables or perform any necessary cleanup
    ball.x = 200;
    ball.y = 300;
    ball.x_speed = 0;
    ball.y_speed = 3;

}

// socket

const loc = window.location;

let wsStart;
if (loc.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

let endpoint = wsStart + loc.host + loc.pathname;
let socket = new WebSocket(endpoint);

const userName = JSON.parse(document.getElementById('json-username').textContent);

socket.onopen = function(e) {
    console.log('onopen', e.data);
}

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('onmessage', data);
    if (data.action === 'game_request') {
        console.log('game_request');
        if (userName === data.opponent) {
            confirm('Game request from ' + data.username);
        }
    }
}

document.getElementById('game-request-submit').onclick = function(e) {
    e.preventDefault();
    console.log('game-request-submit');

    const input = document.querySelector('#game-request-input').value;
    if (input) {
        socket.send(JSON.stringify({
            'action': 'game_request',
            'username': userName,
            'opponent': input,
        }));
    }
}

//game main page

document.getElementById("btn1").addEventListener("click", loadGame);
document.getElementById("btn2").addEventListener("click", unloadGame);
document.getElementById("btn3").addEventListener("click", showInner);
document.getElementById("btn4").addEventListener("click", showInnerBody);
document.getElementById("btn5").addEventListener("click", test);

const gameFile = '';

function test() {
    console.log("Test");

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'test.html', true);
    xhr.onload = function() {
        if (this.status == 200) {
            document.getElementById("game").innerHTML = this.responseText;
        }
    }
    xhr.send();
}

function loadGame() {
    console.log("Loading game...");
    isRunning = true;
    animate(step);
}

function unloadGame() {
    console.log("Unloading game...");
    gameUnload();
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function showInnerBody() {
    console.log("Showing inner HTML...");
    console.log(document.body.innerHTML);
}

function showInner() {
    console.log("Showing inner HTML...");
    console.log(document.getElementById("game").innerHTML);
}

// game.js
