const loc = window.location;
let friendName = '';
const userName = JSON.parse(document.getElementById('json-username').textContent);

if (loc.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

// ws://127.0.0.1:8000/chat/
let endpoint = wsStart + loc.host + loc.pathname;
let socket = new WebSocket(endpoint);

const msg_area = document.querySelector('.msg-area');
const user_area = document.querySelector('.users');

socket.onopen = function(e) {
    console.log('onopen', e.data);
}

socket.onmessage = function(e) {
    console.log('onmessage', e.data);
    const data = JSON.parse(e.data);
    if (data.action === 'friend_request') {
        console.log('onmessage: friend_request');
        if (data.res) {
            add_friend(data.friend, e);
        } else {
            alert('friend request failed');
        }
    } else if (data.action === 'chat_message') {
        console.log('onmessage: chat_message');
        new_message(data.from, data.to, data.msg);
    }
}
socket.onerror = function(e) {
    console.log('onerror', e);
}
socket.onclose = function(e) {
    console.log('onclose', e);
}

/* 
Creates a new message div and adds it to the "msg_area".
*/
function new_message(from, to, msg) {
    let div = document.createElement('div');
    div.innerHTML = `
        <p> ${from} to ${to} </p>
        <p> ${msg} </p>
        `;
    div.className = 'message';
    if (friendName === to) {
        div.style.display = 'block';
        div.style.float = 'right';
    }
    else if (friendName === from) {
        div.style.display = 'block';
        div.style.float = 'left';
        div.style.backgroundColor = '#bfd8a8';
    } else {
        div.style.display = 'none';
    }
    msg_area.appendChild(div);
    scrollBottom();
}


/* 
when the user click the submit button, the "onclick" event will be triggered
and the "send" method will be called.
The "send" method send the data to chatconsumer class "receive" method
and message will be broadcasted to all the users
 */
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


/* 
When the user click the submit button, the "onclick" event will be triggered
and the "send" method will be called.
The "send" method send the data to chatconsumer class "receive" method
and friend request will be sended to the target user
 */
document.querySelector('#friend-request-submit').onclick = function(e) {
    e.preventDefault();

    const messageInputDom = document.querySelector('#friend-request-input');
    const friend = messageInputDom.value;

    // sockete arkadas istegi gonderme
    socket.send(JSON.stringify({
        'action': 'friend_request',
        'username': userName,
        'friend': friend,
    }));

    messageInputDom.value = '';

    return false;
};

/* 
When user click the any ".user" class div, the friendName will be set to the clicked user.
And the "show_priv_msg" method will be called.
*/
document.addEventListener('click', function(e) {
    if (e.target.closest('.user')) {
        var clickedUser = e.target.closest('.user');
        var username = clickedUser.textContent.trim();
        friendName = username;

        show_priv_msg(1);
        document.querySelector('#myform').style.display = 'block';
    }
});

/* 
This method will show the private messages between the user and the friend.
*/
function show_priv_msg() {
    document.querySelectorAll('.message').forEach(function(msg) {
        let line = msg.textContent.split('\n')[1];
        let from = line.split('to')[0].trim();
        let to = line.split('to')[1].trim();

        if (friendName === to) {
            msg.style.display = 'block';
            msg.style.float = 'right';
        }
        else if (friendName === from) {
            msg.style.display = 'block';
            msg.style.float = 'left';
            msg.style.backgroundColor = '#bfd8a8';
        } else {
            msg.style.display = 'none';
        }
        scrollBottom();
    });
}

function add_friend(target, e) {
    console.log('add_friend');
    let html = `
            <p> ${target} </p>
    `;
    let div = document.createElement('div');
    div.className = 'user';
    div.innerHTML += html;
    user_area.appendChild(div);
}

function scrollBottom() {
    msg_area.scrollTop = msg_area.scrollHeight;
    msg_area.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
}

// blocked user

document.querySelector('#blocked-user-button').onclick = function(e) {
    console.log('block-user-button');
    e.preventDefault();

    fetch('userview/')
        .then(response => response.text())
        .then(data => {
            const parsedData = JSON.parse(data);
            console.log(parsedData.data[0].blockeds);
            block_user(parsedData.data[0].blockeds);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    



    return false;
}

function block_user(users) {
    const usersDiv = document.createElement('div');
    usersDiv.className = 'blockeds';
    usersDiv.innerHTML = `
        <p> Blocked Users </p>
        <div class="blockeds">
            ${users.map(user => `<p>${user}</p>`).join('')}
        </div>
    `;
    document.body.appendChild(usersDiv);
}