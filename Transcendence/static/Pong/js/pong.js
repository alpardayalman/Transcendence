const something = {
    playerOneUsername: "Sarp",
    playerTwoUsername: "Arda",
    playerOneScore: 3,
    playerTwoScore: 2,
};

const jsonString = JSON.stringify(something);

const jsonObj = JSON.parse(jsonString);

console.log(jsonObj);

async function main() {
	const DEBUG = false;

	const app = document.getElementById('app');

	const pongJsText = await fetch(window.location.origin + '/static/Pong/js/game.js')
	.then(response => response.text()); 
	if (DEBUG)
		console.log(pongJsText);

	const pongScript = document.createElement('script');
	pongScript.type = 'module';
	pongScript.innerHTML = pongJsText;

	const menuJsText = await fetch(window.location.origin + '/static/Pong/js/menu.js')
	.then(response => response.text());
	if (DEBUG)
		console.log(menuJsText);

	const menuJs = document.createElement('script');
	menuJs.type = 'module';
	menuJs.innerHTML = menuJsText;
}

async function TestMatchApi() {
	console.log('Match API test.');
	var sendData = JSON.stringify({
		'UserOne': 'admin',
		'UserTwo': 'guest',
		'ScoreOne': 3,
		'ScoreTwo': 2,
	})
	var cookie = document.cookie;
	// const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1];
	const csrfToken = cookie.split('=')[1]
	console.log(csrfToken)
	const headers = new Headers();
	headers.append('X-CSRFToken', csrfToken);
	headers.append('Content-Type', 'application/json');
	await fetch(window.location.origin + '/api/match/', {
		method: 'post',
		body: sendData,
		headers: {
			'X-CSRFToken': csrfToken,
			'Content-Type': 'application/json',
		},
	})
		.then(response => response.json())
		.then(response => {
			console.log("fetch response= ", response);
		})
	console.log('Match API test end.');
}

let o;

let sta = false;

async function startPong()
{
	const gameJs = await fetch(window.location.origin + '/static/Pong/js/game.js')
	.then(response => response.text())
	.then(data => {
		const app = document.getElementById('app');
		const canvas = document.createElement('canvas');
		const pong = document.createElement('script');

		canvas.id = 'pong_canvas';
		canvas.width = window.innerWidth / 2;
		canvas.height = window.innerHeight / 2;
		
		pong.innerHTML = data;
		pong.type = 'module';

		
		app.appendChild(canvas);
		app.appendChild(pong);

	})
}

async function checkAcceptance()
{
	console.log("Connecting....")
	await fetch(window.location.origin + '/api/pCheck')
		.then(response => response.json())
		.then(data => {
			if (data.status == true)
			{
				sta = true;
				console.log("USER HAS CONNECTED");
				const div = document.getElementById('gayTahil');
				div.innerText = "Player Connected";
				div.style.color = "#00ff00";
				clearInterval(o);
				const button = document.getElementById('niber');
				button.removeAttribute("disabled");
			}
			else
			{
				console.log("Fetch")
			}
		})
	console.log("BREAK ;");
}

function invitePlayer(username) {
	console.log("request sent to user: " + username);
	const div = document.getElementById('gayTahil');
	div.innerText = "Waiting Player";
	div.style.color = "#ff0000";
	o = setInterval(checkAcceptance, 1000);
}

function readTextField() {
	const textFieldValue = document.getElementById("textInput").value;
	if (textFieldValue != "")
	{
		const button = document.querySelector('.biffer');
		button.removeAttribute("disabled");
	}
	else
	{
		const button = document.querySelector('.biffer');
		button.setAttribute("disabled", "");
	}
	return (textFieldValue);
	// You can perform any other actions with the value here
}

function findPlayer() {
	const username = readTextField();
	invitePlayer(username);
}

// main();

// invitePlayer("Arda");