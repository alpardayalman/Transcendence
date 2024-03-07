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

async function startPong() {
	console.log("START PONG() ====> 2");
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

async function deleteInstance(inv_id) {
	const csrfToken = document.cookie.split('=')[1]
	const head = new Headers();
	head.append('X-CSRFToken', csrfToken);
	head.append('Content-Type', 'application/json');
	console.log('delete pong invite=', window.location.origin + "/api/ponginvitedel/" + inv_id);
	await fetch(window.location.origin + "/api/ponginvitedel/" + inv_id, {
		method: "DELETE"
	})
	.catch(error => {
		console.error(error);
	})
}

async function checkAcceptance(inv_id)
{
	console.log("Connecting....")
	await fetch(window.location.origin + '/api/ponginviteget/' + inv_id)
		.then(response => response.json())
		.then(data => {
			console.log("check acceptence=",data);
			if (data.status == true)
			{
				data = data.data
				if (data.is_active == 1)
				{
					const div = document.getElementById('playerStatus');
					div.innerText = "Player is CUM";
					div.style.color = "#00ff00";
					const button = document.getElementById('niber');
					button.removeAttribute("disabled");
					console.log("Accept the request")
					deleteInstance(inv_id);
					console.log(inv_id);
					clearInterval(o);
				}
				if (data.is_active == 2)
				{
					const div = document.getElementById('playerStatus');
					div.innerText = "Player is not CUM happens";
					div.style.color = "#ff0000";
					console.log("Cancel the request")
					deleteInstance(inv_id);
					clearInterval(o);
				}
				console.log("Connection is pending")
			}
			else
			{
				console.log("Fetch")
			}
		})
	console.log("BREAK....");
}

async function invitePlayer(friends) {
	const myuser = document.querySelector(".userUsername").innerText;
	console.log("request sent to user: " + friends);
	const div = document.getElementById('playerStatus');
	const csrfToken = document.cookie.split('=')[1]
	const head = new Headers();
	head.append('X-CSRFToken', csrfToken);
	head.append('Content-Type', 'application/json');
	var jso = JSON.stringify({
		"invite_id": String(myuser),
		"invitee": String(myuser),
		"invited": String(friends),
		"is_active": 0
	});
	console.log('pong invite=',jso);
	resp = await fetch(window.location.origin + '/api/ponginvite/', {
		method: "POST",
		headers: head,
		body: jso,
	})
	.then(response => response.json())
	.then(data => {
		console.log('pong invite response=',data);
		if (!data.status)
		{
			alert('invite not sended');
			const searchitems = document.querySelector('.searchs');
			const button = searchitems.querySelector('#biffer');
			button.removeAttribute('disabled');
		}
	})
	.catch(error => {
		console.error('pong invite error=',error);
	})
	div.innerText = "Waiting Player";
	div.style.color = "#ff0000";
	o = setInterval(checkAcceptance, 1000, myuser);
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