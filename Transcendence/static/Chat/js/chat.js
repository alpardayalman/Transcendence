let loca = window.location;
let friendName = '';

if (loca.protocol === 'https:') {
    wsStart = 'wss://';
} else {
    wsStart = 'ws://';
}

// ws://127.0.0.1:8000/chat/
let endpoint = wsStart + loca.host + loca.pathname;
let socket = new WebSocket(endpoint);

// const msg_area = document.querySelector('.active');
const user_area = document.querySelector('.content-messages-list');
const userName = document.querySelector('.userName').id;

socket.onopen = function(e) {
    console.log('onopen', e.data);
}

// new 
const chatItem = document.getElementById('chat-item');
const settingsItem = document.getElementById('settings-item');

chatItem.addEventListener('click', () => {
    updateActiveClass('Chats');
});

settingsItem.addEventListener('click', () => {
    updateActiveClass('Settings');
});

function updateActiveClass(selectedTitle) {
    const chatSidebarMenu = document.querySelector('.chat-sidebar-menu');
    const activeItem = chatSidebarMenu.querySelector('.active');

    // Remove "active" class from the previously active item
    activeItem.classList.remove('active');

    // Add "active" class to the clicked item
    const clickedItem = chatSidebarMenu.querySelector(`li[data-title="${selectedTitle}"]`);
    clickedItem.classList.add('active');
}


socket.onmessage = function(e) {
    console.log('onmessage', e.data);
    const data = JSON.parse(e.data);
    if (data.action === 'friend_request') {
        console.log('onmessage: friend_request');
        if (data.res) {
            alert('friend request successfull');
        } else {
            alert('friend request failed');
        }
    } else if (data.action === 'chat_message') {
        console.log('onmessage: chat_message');
        new_message(data.from, data.to, data.msg, data.date);
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
    var msgMe = `
        <div class="conversation-item-side">
            <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="">
        </div>
        <div class="conversation-item-content">
            <div class="conversation-item-wrapper">
                <div class="conversation-item-box">
                    <div class="conversation-item-text">
                        <p>${from} ${to}</p>
                        <p>${msg}</p>
                        <div class="conversation-item-time"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    var msgFriend = `
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"    alt="">
            </div>
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p>${from} ${to}</p>
                            <p>${msg}</p>
                            <div class="conversation-item-time"></div>
                        </div>
                    </div>
                </div>
            </div>
    `;
    let div = document.createElement('li');
    div.id = from;
    div.classList.add('conversation-item');
    if (from === userName) {
        div.innerHTML += msgMe;
    } else if (to === userName) {
        div.classList.add('me');
        div.innerHTML += msgFriend;
    }
    var msgArea = document.querySelectorAll('.conversation').forEach(function(item) {
        if (item.classList.contains('active')) {
            item.querySelector('.conversation-wrapper').appendChild(div);
        }
    });
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




function add_friend(target, e) {
    console.log('add_friend');
    socket.send(JSON.stringify({
        'action': 'friend_request',
        'username': userName,
        'friend': target,
    }));

}
// front

document.querySelectorAll('[data-add]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        var click = e.target.closest('.friend')
        if (click) {
            add_friend(this.dataset.add, e)
        }
    })
});

document.querySelectorAll('[data-block]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        var user = this.dataset.block
        if (user) {
            console.log(user)
        }
    })
});

document.querySelectorAll('[data-title]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        document.querySelectorAll('.content-sidebar').forEach(function(i) {
            i.classList.remove('active')
        })
        document.querySelectorAll('[data-title]').forEach(function(i) {
            i.parentElement.classList.remove('active')
        })
        console.log(this.dataset.title)
        item.parentElement.classList.add('active')
        document.querySelector(this.dataset.title).classList.add('active')
    })
});

document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})


document.querySelectorAll('.conversation-form-input').forEach(function(item) {
    item.addEventListener('input', function() {
        this.rows = this.value.split('\n').length
    })
})

var msgAreaSubmit = `<div class="conversation-form-group">
<textarea class="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
<!-- <button type="button" class="conversation-form-record"><i class="ri-mic-line"></i></button> -->
</div>
<button type="button" id="conversation-form-button" class="conversation-form-button conversation-form-submit"><i class="ri-send-plane-2-line"></i></button>
`

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

function send_message(from, to, msg) {
    const messageInputDom = document.querySelector('.conversation-form-input');
    const message = messageInputDom.value;

    socket.send(JSON.stringify({
        'action': 'chat_message',
        'msg': msg,
        'from': from,
        'to': to,
    }));

    messageInputDom.value = '';

    return false;
}

document.querySelectorAll('[data-send]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        console.log(this.dataset)//#msg-{{friendname}}
        console.log(this.dataset.user)
        var user = this.dataset.user
        var friend = this.dataset.send.split('-')[1]
        var message = this.parentElement.querySelector('textarea').value
        if (message && friend && user) {
            console.log(friend, ' - ',message, ' - ', user)
            send_message(user, friend, message);
        }
    })
})