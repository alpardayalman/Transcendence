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

async function checkAcceptance(username)
{
	console.log("Connecting....")
	await fetch(window.location.origin + '/api/ponginviteget/' + username)
		.then(response => response.json())
		.then(data => {
			if (data.status == true)
			{
				console.log('===data===', data.data)
				data = data.data
				if (data.is_active == 1)
				{
					const div = document.getElementById('playerStatus');
					div.innerText = "Player is CUM";
					div.style.color = "#00ff00";
					clearInterval(o);
					const button = document.getElementById('niber');
					button.removeAttribute("disabled");
				}
				else
				{
					const div = document.getElementById('playerStatus');
					div.innerText = "Player is not CUM happens";
					div.style.color = "#00ff00";
					clearInterval(o);
				}
				sta = true;
				console.log("USER HAS CONNECTED");
			}
			else
			{
				console.log("Fetch")
			}
		})
	console.log("BREAK ;");
}

async function startPong() {
	let page = document.querySelector('.active');
	console.log(page)
	const script = document.createElement('script');

	const div = document.getElementById('vs-page');

    const tmpHeight = div.offsetHeight+100;
    const tmpWidth = div.offsetWidth+100;

	document.querySelectorAll('[data-page]').forEach(function(item) {
		console.log(item)
		document.querySelector(item.dataset.page).classList.remove('active')
	});
	page = document.querySelector('#Game');
	page.classList.add('active');
	script.innerHTML = await fetch(window.location.origin + '/static/Pong/js/game.js')
	.then(response => response.text());
	console.log(script.innerHTML);

    script.type = "module";

	const canvas = document.createElement('canvas');
	canvas.id = 'pong_canvas';
    canvas.width = tmpWidth - (tmpWidth / 4); 
    canvas.height = tmpHeight - (tmpHeight / 4); 

    isRunning = true;

	page.appendChild(canvas);
	page.appendChild(script);
}

function invitePlayer(username) {
	console.log("request sent to user: " + username);
	const div = document.getElementById('playerStatus');
	div.innerText = "Waiting Player";
	div.style.color = "#ff0000";
	o = setInterval(checkAcceptance, 1000, username);
}

function readTextField() {
	const searchitems = document.querySelector('.searchs');
	var textFieldValue = searchitems.querySelector('#textInput').value;
	const button = searchitems.querySelector('#biffer');
	if (textFieldValue != "")
	{
		button.removeAttribute("disabled");
	}
	else
	{
		button.setAttribute("disabled", "");
	}
	return (textFieldValue);
	// You can perform any other actions with the value here
}

function findPlayer() {
	const username = readTextField();
	const button = document.getElementById('biffer');
	button.disabled = true;
	invitePlayer(username);
}

// main();

// invitePlayer("Arda");

/* ============ HTML things ============  */

document.querySelectorAll('[data-page]').forEach(function(item) {
	item.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelectorAll('.page').forEach(function(item) {
			console.log(item.classList);
			item.classList.remove('active');
		});
		document.querySelector(this.dataset.page).classList.add('active');
	});
});