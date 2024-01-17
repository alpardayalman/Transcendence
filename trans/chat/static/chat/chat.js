const loc = window.location;
let friendName = '';
const userName = JSON.parse(document.getElementById('json-username').textContent);

if (loc.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

let endpoint = wsStart + loc.host + loc.pathname;
let socket = new WebSocket(endpoint);

const msg_area = document.querySelector('.msg-area');
const user_area = document.querySelector('.users');

socket.onopen = function(e) {
    console.log('open', e);
}

socket.onmessage = function(e) {
    console.log('message', e.data);
    const data = JSON.parse(e.data);
    if (data.type === 'friend_request') {
        console.log('friend_request onmessage');
        add_friend(data.target);
    } else if (data.type === 'chat_message') {
        console.log('chat onmessage');
        new_message(data.from, data.to, data.msg);
    }
}
socket.onerror = function(e) {
    console.log('error', e);
}
socket.onclose = function(e) {
    console.log('close', e);
}

// create a new div in the msg area
function new_message(from, to, msg) {
    let div = document.createElement('div');
    // let p1 = document.createElement('p');
    // let p2 = document.createElement('p');
    // p1.innerHTML = ' ' + data.from + ' to ' + data.to + ' ';
    // p2.innerHTML = ' ' + data.msg + ' ';
    // div.appendChild(p1);
    // div.appendChild(p2);
    div.innerHTML = `
        <p> ${from} to ${to} </p>
        <p> ${msg} </p>
        `;
    div.className = 'message';
    if (friendName === to) {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
    msg_area.appendChild(div);
}

document.querySelector('#chat-massage-submit').onclick = function(e) {
    e.preventDefault();

    const messageInputDom = document.querySelector('#chat-massage-input');
    const message = messageInputDom.value;

    socket.send(JSON.stringify({
        'action': 'chat_message',
        'msg': message,
        'from': userName,
        'to': friendName,
    }));

    messageInputDom.value = '';

    return false;
};


//arkadas istegi gonderme
document.querySelector('#friend-request-submit').onclick = function(e) {
    e.preventDefault();

    const messageInputDom = document.querySelector('#friend-request-input');
    const message = messageInputDom.value;

    // sockete arkadas istegi gonderme
    const res = socket.send(JSON.stringify({
        'action': 'friend-request',
        'username': userName,
        'target': message,
    }));

    messageInputDom.value = '';

    return false;
};

document.addEventListener('click', function(e) {
// Eğer tıklanan eleman .user sınıfına veya .user içinde bir alt elemana aitse
    if (e.target.closest('.user')) {
        var clickedUser = e.target.closest('.user');
        var username = clickedUser.textContent.trim();
        friendName = username; // soldaki arkadaslara tiklandiginda arkadas ismini alip friendName'e atiyoruz

        show_priv_msg(1);
        document.querySelector('#myform').style.display = 'block';
    }
});

function show_priv_msg() {
    document.querySelectorAll('.message').forEach(function(msg) {
        let line = msg.textContent.split('\n')[1];
        console.log(msg.textContent);
        let from = line.split('to')[0].trim();
        let to = line.split('to')[1].trim();

        // eger mesaj benimse veya arkadasimla konusuyorsam mesajlari goster
        if (to === friendName || from === friendName) {
            msg.style.display = 'block';
        } else {
            msg.style.display = 'none';
        }
    });
}

function add_friend(target) {
    let html = '<div class="user"><p>' + target + '</p></div>';
    querySelector('.users').innerHTML += (html);
}
