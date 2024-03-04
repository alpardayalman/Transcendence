function chatJs()
{
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

    var activeConversation = '';
    // const msg_area = document.querySelector('.active');
    const user_area = document.querySelector('.content-messages-list');
    const userName = document.querySelector('.userName').id;

    socket.onopen = function(e) {
        console.log('onopen', e.data);
    }

    addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            document.querySelector(activeConversation).querySelector('.conversation-form-submit').click();
        }
    });

    socket.onmessage = function(e) {
        console.log('onmessage', e.data);
        const data = JSON.parse(e.data);
        if (data.action === 'pong_request') {
            if (data.update) {
                pong_request(data.username, data.friend, data.update);
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

    async function updatePongInvite(username, friends, status) {
        var jso = JSON.stringify({
            "invite_id": username,
            "invitee": username,
            "invited": friends,
            "is_active": status
        })
        const csrfToken = document.cookie.split('=')[1]
        const head = new Headers();
        head.append('X-CSRFToken', csrfToken);
        head.append('Content-Type', 'application/json');
        await fetch(window.location.origin + '/api/ponginviteput/' + username, {
            method: 'PUT',
            headers: head,
            body: jso,
        })
    }

    function pong_request(username, friend, update) {
        console.log('pong request= ', username, ' ', friend, ' ', update);
        var msgMe = `
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p>${username} ${friend}</p>
                            <p>${update}</p>
                            <div class="conversation-item-time pinvite"></div>
                                <span style="color: white;">
                                    <a href="" data-pinv${username}="${username}${friend}" style="display: grid; grid-template-columns: repeat(2, 1fr);">
                                        <i class="accept" style="color: rgb(25, 255, 101);">&#10003; Accept </i>
                                        <i class="decline" style="color: red;">&#x026D4; Decline</i>
                                    </a>
                                </span>
                            </div>
                    </div>
                </div>
            </div>
            `;
        var game_request = document.createElement('li');
        game_request.innerHTML = msgMe;
        game_request.classList.add('conversation-item');
        game_request.id = username;
        const user = document.querySelector('#conversation-'+username)
        user.querySelector('.conversation-wrapper').appendChild(game_request)
        document.querySelector('[data-pinv'+username+']').addEventListener('click', function(e) {
            e.preventDefault();
            console.log('hello? is there anybody?');
            if (e.target.closest('.accept')) {
                console.log('accept', this.dataset.pinvite)
                updatePongInvite(username, friend, 1);
            } else if (e.target.closest('.decline')) {
                console.log('decline', this.dataset.pinvite)
                updatePongInvite(username, friend, 2);
            }
            document.querySelector('[data-pinv'+username+']').parentElement.innerHTML = `you answered this sheesh`;
        })
    }

    /* 
    Creates a new message div and adds it to the "msg_area".
    */
    function new_message(from, to, msg) {
        var msgMe = `
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&  ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="">
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
                    <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&  ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="">
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
        document.querySelectorAll('.conversation').forEach(function(item) {
            if (item.classList.contains('active')) {
                scrollBottom(item);
                item.querySelector('.conversation-wrapper').appendChild(div);
            }
        });
    }

    function scrollBottom(item) {
        item.scrollTop = item.scrollHeight;
        item.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }

        /* 
        When the user click the submit button, the "onclick" event will be triggered
        and the "send" method will be called.
        The "send" method send the data to chatconsumer class "receive" method
        and friend request will be sended to the target user
        */
    document.querySelector('.content-sidebar-submit').onclick = function(e) {
        e.preventDefault();
        // search button
    };

    // {"username": "admin", "block": "ahmet"}

    async function block_user(target) {
        var head = {
            method: 'post',
            body: JSON.stringify({
                'username': userName,
                'block': target,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1];
        console.log(csrfToken);
        const headers = new Headers();
        headers.append('X-CSRF-Token', `${csrfToken}`);
        headers.append('Content-Type', 'application/json');
        await fetch(window.location.origin + '/api/block/', {
            method: 'post',
            body: JSON.stringify({
                'username': userName,
                'block': target,
            }),
            headers: headers,})
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        console.log('fetch sended');

    }

    function add_friend(target, e) {
        console.log('add_friend');
        socket.send(JSON.stringify({
            'action': 'friend_request',
            'username': userName,
            'friend': target,
        }));

    }
    // front

    // document.querySelectorAll('.pinvite').forEach(function(item) {
    //     item.addEventListener('click', function(e) {
    //             e.preventDefault();
    //             console.log('hello? is there anybody?');
    //             if (e.target.closest('.accept')) {
    //                 console.log('accept', this.dataset.pinvite)
    //             } else if (e.target.closest('.decline')) {
    //                 console.log('decline', this.dataset.pinvite)
    //             }
    //         })
    // })

    // document.querySelectorAll('[data-pinvite]').forEach(function(item) {
    //     item.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         console.log('hello? is there anybody?');
    //         if (e.target.closest('.accept')) {
    //             console.log('accept', this.dataset.pinvite)
    //         } else if (e.target.closest('.decline')) {
    //             console.log('decline', this.dataset.pinvite)
    //         }
    //     })
    // })

    document.querySelectorAll('[data-add]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault()
            if (e.target.closest('.friend')) {
                add_friend(this.dataset.add, e)
            } else if (e.target.closest('.block')) {
                console.log('block', this.dataset.add)
                block_user(this.dataset.add)
            }
        })
    });

    document.querySelectorAll('[data-block]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault()
            var user = this.dataset.block
            if (user) {
                console.log(user)
                block_user(user)
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
        if (this.parentElement.classList.contains('active'))
            this.parentElement.classList.remove('active')
        else
            this.parentElement.classList.toggle('active')
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
                var user = item.querySelector('.content-message-name').textContent
                friendName = user
                document.querySelector('.conversation-user-name').innerHTML = user
            })
            document.querySelector(this.dataset.conversation).classList.add('active')
            activeConversation = this.dataset.conversation
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
}

chatJs();