async function startVersus(user1, user2) {
	let page = document.querySelector('.active');
	const script = document.createElement('script');

	const div = document.getElementById('vs-page');

	document.getElementById('gameNavi').disabled = true;

	document.querySelectorAll('[data-page]').forEach(function(item) {
		document.querySelector(item.dataset.page).classList.remove('active')
	});
	page = document.querySelector('#Game');
	page.classList.add('active');

	const head = new Headers();
	head.append('Authorization', getCookie('access_token'));
	let js = await fetch(window.location.origin + '/static/Pong/js/game.js', {
		headers: head,
	})
	.then(response => response.text());
	
	js = js.replaceAll('{{ USERNAME_1 }}', user1);
	js = js.replaceAll('{{ USERNAME_2 }}', user2); 
	script.innerHTML = js;

    script.type = "module";

	const canvas = document.createElement('canvas');
	canvas.id = 'pong_canvas';

	canvas.style.position = 'relative';
	canvas.style.top = '50px'; 
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
	let page = document.querySelector('.active');
	const script = document.createElement('script');

	const div = document.getElementById('vs-page');

	document.getElementById('gameNavi').disabled = true;

	document.querySelectorAll('[data-page]').forEach(function(item) {
		document.querySelector(item.dataset.page).classList.remove('active')
	});
	page = document.querySelector('#Game');
	page.classList.add('active');

	const head = new Headers();
	head.append('Authorization', getCookie('access_token'));
	let js = await fetch(window.location.origin + '/static/Pong/js/tournament.js', {
		headers: head,
	})
	.then(response => response.text());
	
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
	canvas.style.top = '50px'; 
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
	head.append('Authorization', getCookie('access_token'));
	await fetch(window.location.origin + "/api/ponginvitedel/" + inv_id, {
		method: "DELETE",
		headers: head,
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
	const head = new Headers();
	head.append('Authorization', getCookie('access_token'));
	await fetch(window.location.origin + '/api/ponginviteget/' + clientUsername, {
		headers: head,
	})
		.then(response => response.json())
		.then(async data => {
			if (data.status == true)
			{
				data = data.data
				if (data.is_active == 1)
				{
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
					clearTimeout(intervalHandler["setTimeout"]);
					stopInvite(inputID, clientUsername, nameSpaceID, 0);
				}
				if (data.is_active == 2)
				{
					const div = document.getElementById(nameSpaceID);
					div.innerText = "Player is not come.";
					div.style.color = "#ff0000";
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
	head.append('Authorization', getCookie('access_token'));

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
			item.classList.remove('active');
		});
		document.querySelector(this.dataset.page).classList.add('active');
	});
});

function translateToTr() {
	const infoText = document.getElementById('info-text');
	const rows = infoText.querySelectorAll('.game-info-row');
	rows[0].innerText = "Her iki oyuncu da kendi tarafındaki masada birer topla başlar.";
	rows[1].innerText = "Oyuncular, topları rakip sahanın zeminine değdirmeye çalışırlar.";
	rows[2].innerText = "Top zeminine değdiğinde, o topu atan oyuncu bir puan kazanır.";
	rows[3].innerText = "İlk önce belirlenen puana ulaşan oyuncu oyunu kazanır.";
	document.getElementById('info-game-up').innerText = 'Yukarı';
	document.getElementById('info-game-down').innerText = 'Aşağı';
	document.getElementById('info-game-enemy').innerText = 'Rakip';
	document.getElementById('info-game-you').innerText = 'Siz';
	document.getElementById("game-info-1v1").innerText = '1v1';
	document.getElementById("game-info-Tour").innerText = "Turnuva";
	const infoTextDown = document.getElementById('info-text-down');
	const downRows = infoTextDown.querySelectorAll('.game-info-row-down');
	downRows[0].innerText = "Birden fazla oyuncu birbiriyle yarışır.";
	downRows[1].innerText = "Her oyuncu, diğer tüm oyuncularla bir kez maç yapar.";
	downRows[2].innerText = "En çok puanı alan oyuncu turnuvayı kazanır.";
	document.getElementById('info-game-modes').innerText = "Oyun Modları";
	document.getElementById('info-game-controls').innerText = "Kontroller";
	document.getElementById('info-game-mode').innerText = "Turnuva Modu";
	document.getElementById('info-game-lar').innerText = "Oyun Akışı";
	document.getElementById('niber').innerText = "Pong Oyna";
	document.getElementById('niber2').innerText = "Pong Oyna";
	document.getElementById('niberGuest').innerText = "Misafirle Oyna";
	document.getElementById('invB1').innerText = "Istek Yolla";
	document.getElementById('invB2').innerText = "Istek Yolla";
	document.getElementById('invB3').innerText = "Istek Yolla";
	document.getElementById('invB4').innerText = "Istek Yolla";
	document.getElementById('user1').innerText = "Kullanıcı Adı";
	document.getElementById('user2').innerText = "Kullanıcı Adı";
	document.getElementById('user3').innerText = "Kullanıcı Adı";
	document.getElementById('user4').innerText = "Kullanıcı Adı";
	document.getElementById('pong-tour-button').innerText = "Turnuva";
	document.getElementById('pong-1v1-button').innerText = "1v1";
	document.getElementById('pong-info-button').innerText = "Bilgi";
}

function translateToEn() {
	const infoText = document.getElementById('info-text');
	const rows = infoText.querySelectorAll('.game-info-row');
	rows[0].innerText = "Both players start with one ball on their side of the table.";
	rows[1].innerText = "Players try to hit the balls to the ground on the opponent's side.";
	rows[2].innerText = "The player who hits the ball to the ground gets a point.";
	rows[3].innerText = "The first player to reach the specified score wins the game.";
	document.getElementById('info-game-up').innerText = 'Up';
	document.getElementById('info-game-down').innerText = 'Down';
	document.getElementById('info-game-enemy').innerText = 'Opponent';
	document.getElementById('info-game-you').innerText = 'You';
	document.getElementById("game-info-1v1").innerText = '1v1';
	document.getElementById("game-info-Tour").innerText = "Tournament";
	const infoTextDown = document.getElementById('info-text-down');
	const downRows = infoTextDown.querySelectorAll('.game-info-row-down');
	downRows[0].innerText = "Multiple players compete against each other.";
	downRows[1].innerText = "Each player plays against all other players once.";
	downRows[2].innerText = "The player with the most points wins the tournament.";
	document.getElementById('info-game-modes').innerText = "Game Modes";
	document.getElementById('info-game-controls').innerText = "Controls";
	document.getElementById('info-game-mode').innerText = "Tournament Mode";
	document.getElementById('info-game-lar').innerText = "Game Flow";
	document.getElementById('niber').innerText = "Play Pong";
	document.getElementById('niber2').innerText = "Play Pong";
	document.getElementById('niberGuest').innerText = "Play with Guest";
	document.getElementById('invB1').innerText = "Send Invitation";
	document.getElementById('invB2').innerText = "Send Invitation";
	document.getElementById('invB3').innerText = "Send Invitation";
	document.getElementById('invB4').innerText = "Send Invitation";
	document.getElementById('user1').innerText = "Username";
	document.getElementById('user2').innerText = "Username";
	document.getElementById('user3').innerText = "Username";
	document.getElementById('user4').innerText = "Username";
	document.getElementById('pong-tour-button').innerText = "Tournament";
	document.getElementById('pong-1v1-button').innerText = "1v1";
	document.getElementById('pong-info-button').innerText = "Info";
}

function translateToFr() {
	const infoText = document.getElementById('info-text');
	const rows = infoText.querySelectorAll('.game-info-row');
	rows[0].innerText = "Les deux joueurs commencent avec une balle de leur côté de la table.";
	rows[1].innerText = "Les joueurs essaient de frapper les balles au sol du côté adverse.";
	rows[2].innerText = "Le joueur qui frappe la balle au sol marque un point.";
	rows[3].innerText = "Le premier joueur à atteindre le score spécifié gagne la partie.";
	document.getElementById('info-game-up').innerText = 'Haut';
	document.getElementById('info-game-down').innerText = 'Bas';
	document.getElementById('info-game-enemy').innerText = 'Adversaire';
	document.getElementById('info-game-you').innerText = 'Vous';
	document.getElementById("game-info-1v1").innerText = '1v1';
	document.getElementById("game-info-Tour").innerText = "Tournoi";
	const infoTextDown = document.getElementById('info-text-down');
	const downRows = infoTextDown.querySelectorAll('.game-info-row-down');
	downRows[0].innerText = "Plusieurs joueurs s'affrontent.";
	downRows[1].innerText = "Chaque joueur joue une fois contre tous les autres joueurs.";
	downRows[2].innerText = "Le joueur qui a le plus de points remporte le tournoi.";
	document.getElementById('info-game-modes').innerText = "Modes de jeu";
	document.getElementById('info-game-controls').innerText = "Contrôles";
	document.getElementById('info-game-mode').innerText = "Mode Tournoi";
	document.getElementById('info-game-lar').innerText = "Déroulement du jeu";
	document.getElementById('niber').innerText = "Jouer au Pong"; // Jouer au Pong is a more natural way to say "Play Pong" in French
	document.getElementById('niber2').innerText = "Jouer au Pong";
	document.getElementById('niberGuest').innerText = "Jouer avec un invité";
	document.getElementById('invB1').innerText = "Envoyer une invitation";
	document.getElementById('invB2').innerText = "Envoyer une invitation";
	document.getElementById('invB3').innerText = "Envoyer une invitation";
	document.getElementById('invB4').innerText = "Envoyer une invitation";
	document.getElementById('user1').innerText = "Nom d'utilisateur";
	document.getElementById('user2').innerText = "Nom d'utilisateur";
	document.getElementById('user3').innerText = "Nom d'utilisateur";
	document.getElementById('user4').innerText = "Nom d'utilisateur";
	document.getElementById('pong-tour-button').innerText = "Tournoi";
	document.getElementById('pong-1v1-button').innerText = "1v1";
	document.getElementById('pong-info-button').innerText = "Info";
}

if (language == "EN")
	translateToEn();
else if (language == "TR")
	translateToTr();
else
	translateToFr();

document.getElementById('hostName1').innerText = document.querySelector(".userUsername").innerText;
document.getElementById('hostName2').innerText = document.querySelector(".userUsername").innerText;
deleteInstance(document.querySelector(".userUsername").innerText);