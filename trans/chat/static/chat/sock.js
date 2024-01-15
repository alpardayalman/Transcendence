let friendName = '';
const userName = JSON.parse(document.getElementById('json-username').textContent)
const roomName = 'chat';

const chat_socket = new WebSocket(
    'ws://' + window.location.host + '/ws/' + 'chat' + '/'
);

chat_socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.message) {
        let div = document.createElement('div');
        div.innerHTML = '<p>' + data.username + ' to ' + data.friend + '</p><p>' + data.message + '</p>';
        div.className = 'message';
        div.style.display = 'block';
        document.querySelector('.msg-area').appendChild(div);
    }
    if (data.result) {
        let html = '<div class="user"><p>' + data.target + '</p></div>';
        document.querySelector('.users').innerHTML += (html);
    }
};

chat_socket.onopen = function(e) {
    console.log('Chat socket connected');
};

chat_socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-massage-submit').onclick = function(e) {
    e.preventDefault();

    const messageInputDom = document.querySelector('#chat-massage-input');
    const message = messageInputDom.value;

    chat_socket.send(JSON.stringify({
        'action': 'chat-message',
        'message': message,
        'username': userName,
        'friend': friendName,
        'room': roomName,
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
    const res = chat_socket.send(JSON.stringify({
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
    inn = msg.innerHTML
    inn = inn.replace(/<[^>]*>?/gm, '');
    inn = inn.split('\n');
    inn = inn[1].split(' to ');
    myuser = inn[0].trim();
    // eger mesaj benimse veya arkadasimla konusuyorsam mesajlari goster
    if (inn[1] === friendName || myuser === friendName) {
        msg.style.display = 'block';
    } else {
        msg.style.display = 'none';
    }
});
}

function print_friend() {
    let html = '<div class="user"><p>' + data.target + '</p></div>';
    querySelector('.users').innerHTML += (html);
}