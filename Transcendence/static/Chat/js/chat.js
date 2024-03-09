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
    // const user_area = document.querySelector('.content-messages-list');
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
        } else if (data.action === 'block_user') {

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

    document.querySelector('.content-sidebar-submit').onclick = function(e) {
        e.preventDefault();
        // search button
    };

    // ================================================ BLOCK AND ADD FRIEND ========================
    async function block_user(target) {
        
    }

    // ================================================ add block or friend <li> element to html ========================
    function addListElement(status, target) {
        let spirisantus = 0;
        document.querySelectorAll('[data-conversation]').forEach(function(item) {
            console.log(item.dataset.conversation, "#conversation-"+target);
            if (item.dataset.conversation == "#conversation-"+target && status == "friend") {
                alert('this user already friend')
                spirisantus = 1;
            }
        })
        document.querySelectorAll('[data-block]').forEach(function(item) {
            console.log(item.dataset.block);
            if (target == item.dataset.block && status == "friend") {
                spirisantus = 1;
                alert('this user is blocked');
            }
        })
        if (spirisantus) {
            return false;//======= target is friend already =========
        }

        // ============= if user not friend =================
        const li = document.createElement('li');
        var html;
        if (status === "blocked") {
            var blockeds = document.querySelector('#Blockeds');
            blockeds = blockeds.querySelector('.content-messages-list');
            html = `
            <a href="" data-block="${target}">
            <img class="content-message-image"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            alt="">
            <span class="content-message-info">
            <span class="content-message-name">${target}</span>
            </span>
            </a>
            `
            li.innerHTML += html;
            const status = confirm("You sure block that shity pep" + target)
            if (!status) {
                return false;
            }
            socket.send(JSON.stringify({
                "action": "block_user",
                "block": target,
                "user": userName
            }))
            blockeds.appendChild(li);
            
        } else if (status === "friend") {
            var friends = document.querySelector('#Friends');
            friends = friends.querySelector('.content-messages-list');
            html = `
                <a href="" data-conversation="#conversation-${target}">
                    <img class="content-message-image"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                        alt="">
                    <span class="content-message-info">
                        <span class="content-message-name">${target}</span>
                    </span>
                </a>
            `
            li.innerHTML += html
            const div = document.createElement('div');
            div.classList.add("conversation")
            div.id = "conversation-" + target;
            var mainArea = `
                <div class="conversation-top">
                    <button type="button" class="conversation-back"><i class="ri-arrow-left-line">&laquo;</i></button>
                    <div class="conversation-user">
                        <img class="conversation-user-image"
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                            alt="">
                        <div>
                            <div class="conversation-user-name">${target}</div>
                            <div class="conversation-user-status online">online</div>
                        </div>
                    </div>
                </div>
                <div class="conversation-main">
                    <ul class="conversation-wrapper">
                    </ul>
                </div>
                <div class="conversation-form">
                    <!-- <button type="button" class="conversation-form-button"><i class="ri-emotion-line"></i></button> -->
                    <div class="conversation-form-group" id="msg-${target}">
                        <textarea class="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
                        <!-- <button type="button" class="conversation-form-record"><i class="ri-mic-line"></i></button> -->
                    </div>
                    <button data-send="#msg-${target}" data-user="${userName}" type="button"
                        id="conversation-form-button" class="conversation-form-button conversation-form-submit"><i
                            class="ri-send-plane-2-line">Submit</i></button>
                </div>
            `
            div.innerHTML = mainArea;
            const cont = document.querySelector('.chat-content');
            cont.appendChild(div)
            friends.appendChild(li);
            let conv = document.querySelector('#Friends').querySelector('.content-messages-list');
            let iNeedThisConv = conv.lastElementChild.querySelector("a");
            console.log(cont.lastElementChild)
            sendClickEvent(cont.lastElementChild.querySelector('.conversation-form-submit'))
            conversationClickEvent(iNeedThisConv);
            socket.send(JSON.stringify({
                'action': 'friend_request',
                'username': userName,
                'friend': target,
            }));
        }
        return true;
    }

    document.querySelectorAll('[data-choise]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault()
            if (e.target.closest('.friend')) {
                addListElement("friend", this.dataset.choise)
            } else if (e.target.closest('.block')) {
                console.log('block', this.dataset.choise)
                block_user(this.dataset.choise)
                addListElement("blocked", this.dataset.choise)
            }
        })
    });

    document.querySelectorAll('[data-block]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault()
            var user = this.dataset.block
            if (user) {
                console.log(user)
                // unblock users
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
    function conversationClickEvent(item) {
        // console.log(item);
        item.addEventListener('click', function(e) {
            e.preventDefault()
            document.querySelectorAll('.conversation').forEach(function(i) {
                i.classList.remove('active')
                var user = item.querySelector('.content-message-name').textContent
                friendName = user
                document.querySelector('.conversation-user-name').innerHTML = user
            })
            // console.log("lan=======", this);
            document.querySelector(this.dataset.conversation).classList.add('active')
            activeConversation = this.dataset.conversation
            // sendClickEvent();
        })
    }

    document.querySelectorAll('[data-conversation]').forEach(function(item) {
        conversationClickEvent(item);
    //     item.addEventListener('click', function(e) {
    //         e.preventDefault()
    //         document.querySelectorAll('.conversation').forEach(function(i) {
    //             i.classList.remove('active')
    //             var user = item.querySelector('.content-message-name').textContent
    //             friendName = user
    //             document.querySelector('.conversation-user-name').innerHTML = user
    //         })
    //         document.querySelector(this.dataset.conversation).classList.add('active')
    //         activeConversation = this.dataset.conversation
    // })
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

    function sendClickEvent(item) {
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
    }

    document.querySelectorAll('[data-send]').forEach(function(item) {
        sendClickEvent(item);
    })
}

chatJs();