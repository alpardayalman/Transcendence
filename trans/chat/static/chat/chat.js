let loc = window.location;
let friendName = '';
let userName = JSON.parse(document.getElementById('json-username').textContent);

if (loc.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

// ws://127.0.0.1:8000/chat/
let endpoint = wsStart + loc.host + loc.pathname;
let socket = new WebSocket(endpoint);

const msg_area = document.querySelector('.conversation-wrapper');
const user_area = document.querySelector('.content-messages-list');

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
    let div = document.createElement('li');
    div.innerHTML = `
        <div class="conversation-item-side">
            <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="">
        </div>
        <div class="conversation-item-content">
            <div class="conversation-item-wrapper">
                <div class="conversation-item-box">
                    <div class="conversation-item-text">
                        <p>${msg}</p>
                        <div class="conversation-item-time">12:30</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    if (friendName === to && userName === from) {
        div.className = 'conversation-item';
    }
    else if (friendName === from && userName === to) {
        div.className = 'conversation-item me';
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
// document.querySelector('.conversation-form-submit').onclick = function(e) {
//     e.preventDefault();

//     const messageInputDom = document.querySelector('.conversation-form-input');
//     const message = messageInputDom.value;

//     socket.send(JSON.stringify({
//         'action': 'chat_message',
//         'msg': message,
//         'from': userName,
//         'to': friendName,
//     }));

//     messageInputDom.value = '';

//     return false;
// };


function send() {
    e.preventDefault();

    const messageInputDom = document.querySelector('.conversation-form-input');
    const message = messageInputDom.value;

    socket.send(JSON.stringify({
        'action': 'chat_message',
        'msg': message,
        'from': userName,
        'to': friendName,
    }));

    messageInputDom.value = '';

    return false;
}


/* 
When the user click the submit button, the "onclick" event will be triggered
and the "send" method will be called.
The "send" method send the data to chatconsumer class "receive" method
and friend request will be sended to the target user
 */
document.querySelector('.content-sidebar-submit').onclick = function(e) {
    e.preventDefault();

    const messageInputDom = document.querySelector('.content-sidebar-input');
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
        var users = document.querySelectorAll('.user');
        users.forEach(function(user) {
            console.log(user);
            if (user == clickedUser) {
                user.style.backgroundColor = 'rgb(168, 220, 147)';
            } else {
                user.style.backgroundColor = 'aquamarine';
            }
        });
        friendName = username;

        show_priv_msg(1);
        document.querySelector('#myform').style.display = 'block';
    }
});

/* 
This method will show the private messages between the user and the friend.
*/
function show_priv_msg() {
    document.querySelectorAll('#' + friendName).forEach(function(msg) {
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
        <a href="#" data-conversation="#conversation-1">
            <img class="content-message-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="">
            <span class="content-message-info">
                <span class="content-message-name">${target}</span>
            </span>
        </a>
    `;
    let div = document.createElement('li');
    // div.className = 'user';
    div.innerHTML += html;
    user_area.appendChild(div);
}

function scrollBottom() {
    msg_area.scrollTop = msg_area.scrollHeight;
    msg_area.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
}

// blocked user

// document.querySelector('#blocked-user-button').onclick = function(e) {
//     console.log('block-user-button');
//     e.preventDefault();

//     fetch('userview/')
//         .then(response => response.text())
//         .then(data => {
//             const parsedData = JSON.parse(data);
//             console.log(parsedData.data[0].blockeds);
//             block_user(parsedData.data[0].blockeds);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     return false;
// }

// function block_user(users) {
//     const usersDiv = document.createElement('div');
//     usersDiv.className = 'blockeds';
//     usersDiv.innerHTML = `
//         <p> Blocked Users </p>
//         <div class="blockeds">
//             ${users.map(user => `<p>${user}</p>`).join('')}
//         </div>
//     `;
//     document.body.appendChild(usersDiv);
// }


// document.querySelectorAll('.conversation-form-submit').forEach(function(item) {
//     item.addEventListener('click', function(e) {
//         e.preventDefault()
//         send();
//     })
// })


// front
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})

document.querySelectorAll('.conversation-item-dropdown-toggle').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        if(this.parentElement.classList.contains('active')) {
            this.parentElement.classList.remove('active')
        } else {
            document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
                i.classList.remove('active')
            })
            this.parentElement.classList.add('active')
        }
    })
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.conversation-item-dropdown, .conversation-item-dropdown *')) {
        document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
            i.classList.remove('active')
        })
    }
})

document.querySelectorAll('.conversation-form-input').forEach(function(item) {
    item.addEventListener('input', function() {
        this.rows = this.value.split('\n').length
    })
})

document.querySelectorAll('[data-conversation]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        document.querySelectorAll('.conversation').forEach(function(i) {
            i.classList.remove('active')
            var user = item.querySelector('.content-message-name').textContent;
            friendName = user;
            document.querySelector('.conversation-user-name').innerHTML = user;
        })
        document.querySelector(this.dataset.conversation).classList.add('active')
    })
})

document.querySelectorAll('.conversation-back').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})