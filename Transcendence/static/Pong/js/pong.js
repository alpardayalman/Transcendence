async function startVersus(user1, user2) {
	console.log("START PONG() ====> 1");
	let page = document.querySelector('.active');
	console.log(page)
	const script = document.createElement('script');

	const div = document.getElementById('vs-page');

	document.getElementById('gameNavi').disabled = true;

	document.querySelectorAll('[data-page]').forEach(function(item) {
		console.log(item)
		document.querySelector(item.dataset.page).classList.remove('active')
	});
	page = document.querySelector('#Game');
	page.classList.add('active');
	let js = await fetch(window.location.origin + '/static/Pong/js/game.js')
	.then(response => response.text());
	console.log(script.innerHTML);
	
	js = js.replaceAll('{{ USERNAME_1 }}', user1);
	js = js.replaceAll('{{ USERNAME_2 }}', user2); 
	script.innerHTML = js;

    script.type = "module";

	const canvas = document.createElement('canvas');
	canvas.id = 'pong_canvas';

	canvas.style.position = 'relative';
	canvas.style.top = '50px'; // Adjust as needed
	canvas.style.left = '50%';
	canvas.style.transform = 'translateX(-50%)';

    isRunning = true;

	page.appendChild(canvas);
	page.appendChild(script);
	document.getElementById('scoreBoard').hidden = false;
	document.getElementById('gameNavi').hidden = true;
}

async function startTournament(user1, user2, user3, user4, alias1, alias2, alias3, alias4)
{
	console.log("START PONG() ====> 2");
	let page = document.querySelector('.active');
	console.log(page)
	const script = document.createElement('script');

	const div = document.getElementById('vs-page');

	document.getElementById('gameNavi').disabled = true;

	document.querySelectorAll('[data-page]').forEach(function(item) {
		console.log(item)
		document.querySelector(item.dataset.page).classList.remove('active')
	});
	page = document.querySelector('#Game');
	page.classList.add('active');
	let js = await fetch(window.location.origin + '/static/Pong/js/tournament.js')
	.then(response => response.text());
	console.log(script.innerHTML);
	
	js = js.replaceAll('{{ USERNAME_1 }}', user1);
	js = js.replaceAll('{{ USERNAME_2 }}', user2);
	js = js.replaceAll('{{ USERNAME_3 }}', user3);
	js = js.replaceAll('{{ USERNAME_4 }}', user4); 

	js = js.replaceAll('{{ ALIAS_1 }}', alias1);
	js = js.replaceAll('{{ ALIAS_2 }}', alias2);
	js = js.replaceAll('{{ ALIAS_3 }}', alias3);
	js = js.replaceAll('{{ ALIAS_4 }}', alias4);

	script.innerHTML = js;

    script.type = "module";

	const canvas = document.createElement('canvas');
	canvas.id = 'pong_canvas';

	canvas.style.position = 'relative';
	canvas.style.top = '50px'; // Adjust as needed
	canvas.style.left = '50%';
	canvas.style.transform = 'translateX(-50%)';

    isRunning = true;

	page.appendChild(canvas);
	page.appendChild(script);
	document.getElementById('scoreBoard').hidden = false;
	document.getElementById('gameNavi').hidden = true;
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

async function checkAcceptance(inputID, nameSpaceID, buttonID, username, clientUsername)
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
					if (buttonID == 'invB1')
					{
						document.getElementById('niberGuest').disabled = true;
						document.getElementById('niber').disabled = false;
					}
					document.getElementById(inputID).hidden = true;
					document.getElementById(buttonID).hidden = true;
					console.log("Accept the request")
					clearTimeout(intervalHandler["setTimeout"]);
					stopInvite(inputID, clientUsername, nameSpaceID, 0);
				}
				if (data.is_active == 2)
				{
					console.log("data.is_active: " + 2);
					const div = document.getElementById(nameSpaceID);
					div.innerText = "Player is not CUM happens";
					div.style.color = "#ff0000";
					console.log("Cancel the request")
					clearTimeout(intervalHandler["setTimeout"]);
					stopInvite(inputID, clientUsername, nameSpaceID, 0)
				}
				console.log("Connection is pending...")
			}
		});
}

document.getElementById('niber').addEventListener('click', async function(event) {
	event.preventDefault();

	const user1 = document.querySelector(".userUsername").innerText;
	const user2 = document.getElementById('inv1').value;

	
	
	startVersus(user1, user2);
});


document.getElementById('niberGuest').addEventListener('click', async function(event) {
	event.preventDefault();

	const user1 = document.querySelector(".userUsername").innerText;

	startVersus(user1, "Guest");
});


document.getElementById('niber2').addEventListener('click', async function(event) {
	event.preventDefault();

	const user1 = document.querySelector(".userUsername").innerText;
	let user2 = document.getElementById('user2').innerText;
	let user3 = document.getElementById('user3').innerText;
	let user4 = document.getElementById('user4').innerText;

	let alias1 = document.getElementById('aliasTour').value;
	if (!(alias1 != ""))
		alias1 = "Homosapien";
	let alias2 = document.getElementById('alias2').value; 
	if (!(alias2 != ""))
		alias2 = "SilverBack";
	let alias3 = document.getElementById('alias3').value;
	if (!(alias3 != ""))
		alias3 = "JarJarBings";
	let alias4 = document.getElementById('alias4').value;
	if (!(alias4 != ""))
		alias4 = "Tspin";

	if (user2 == "Username")
		user2 = "Guest";
	if (user3 == "Username")
		user3 = "Guest";
	if (user4 == "Username")
		user4 = "Guest";
	startTournament(user1, user2, user3, user4, alias1, alias2, alias3, alias4);
})

async function invitePlayer(inputID, nameSpaceID, buttonID, username) {
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

	intervalHandler[inputID] = setInterval(checkAcceptance, 1000, inputID, nameSpaceID, buttonID, username, clientUsername);
	intervalHandler["setTimeout"] = setTimeout(() => {
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
	if (username == document.querySelector(".userUsername").innerText)
		return ;
	invitePlayer(inputID, divID, buttonID, username);
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
deleteInstance(document.querySelector(".userUsername").innerText);