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

async function stopInvite(inputID, username, nameSpaceID, timeOut)
{
	if (timeOut)
	{
		const div = document.getElementById(nameSpaceID);
		div.innerText = "Invite timeout";
		div.style.color = "#000000";	
	}
	await deleteInstance(username);
	clearInterval(intervalHandler[inputID]);
}

async function checkAcceptance(inputID, nameSpaceID, username, clientUsername)
{
	console.log("Connecting....")
	await fetch(window.location.origin + '/api/ponginviteget/' + clientUsername)
		.then(response => response.json())
		.then(async data => {
			console.log("check acceptence=",data);
			if (data.status == true)
			{
				data = data.data
				if (data.is_active == 1)
				{
					console.log("data.is_active: " + 1);
					const div = document.getElementById(nameSpaceID);
					div.innerText = username;
					div.style.color = "#00ff00";
					const button = document.getElementById('niber');
					button.removeAttribute("disabled");
					console.log("Accept the request")
					stopInvite(inputID, clientUsername, nameSpaceID, 0);
				}
				if (data.is_active == 2)
				{
					console.log("data.is_active: " + 2);
					const div = document.getElementById(nameSpaceID);
					div.innerText = "Player is not CUM happens";
					div.style.color = "#ff0000";
					console.log("Cancel the request")
					stopInvite(inputID, clientUsername, nameSpaceID, 0)
				}
				console.log("Connection is pending...")
			}
		});
}

async function invitePlayer(inputID, nameSpaceID, username) {
	const clientUsername = document.querySelector(".userUsername").innerText;
	const csrfToken = document.cookie.split('=')[1]
	const head = new Headers();
	const div = document.getElementById(nameSpaceID);
	head.append('X-CSRFToken', csrfToken);
	head.append('Content-Type', 'application/json');

	let isInviteValid = true;

	var jso = JSON.stringify({
		"invite_id": String(clientUsername),
		"invitee": String(clientUsername),
		"invited": String(username),
		"is_active": 0
	});

	await fetch(window.location.origin + '/api/ponginvite/', {
		method: "POST",
		headers: head,
		body: jso,
	})
	.then(response => response.json())
	.then(data => {
		console.log('pong invite response=',data);
		if (!data.status)
		{
			alert('INVITE INVALID');
			isInviteValid = false;
		}
	})
	.catch(error => {
		console.error('pong invite error=',error);
	})
	if (!isInviteValid)
		return ;
	div.innerText = "Waiting Player";
	div.style.color = "#ff0000";

	intervalHandler[inputID] = setInterval(checkAcceptance, 1000, inputID, nameSpaceID, username, clientUsername);
	setTimeout(() => {
		stopInvite(inputID, clientUsername, nameSpaceID, 1);
		clearInterval(intervalHandler[inputID]);
	}, 10000);
}

function readTextField(inputID, buttonID) {
	const textFieldValue = document.getElementById(inputID).value;
	const button = document.getElementById(buttonID);

	if (textFieldValue != "") {
		button.removeAttribute("disabled");
	} else {
		button.setAttribute("disabled", "");
	}
	return (textFieldValue);
}

function findPlayer(inputID, buttonID, divID) {
	const username = readTextField(inputID, buttonID);
	document.getElementById(buttonID).disabled = true;
	invitePlayer(inputID, divID, username);
}

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

document.getElementById('hostName1').innerText = document.querySelector(".userUsername").innerText;
document.getElementById('hostName2').innerText = document.querySelector(".userUsername").innerText;