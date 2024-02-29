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

let o;

let sta = false;
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