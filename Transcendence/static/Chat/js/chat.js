function TRlangue() {
    document.querySelectorAll("#BlockText").forEach(function (item) {
        item.innerText = "Engellenenler";
    });
    document.querySelectorAll("#searchText").forEach(function (item) {
        item.innerText = "Arama";
    });
    document.querySelectorAll("#friendsText").forEach(function (item) {
        item.innerText = "Arkadaşlar";
    });
    document.getElementById("sidebarF").innerText = "A";
    document.getElementById("sidebarB").innerText = "E";
    document.getElementById("sidebarS").innerText = "A";
}

function FRlangue() {
    document.querySelectorAll("#BlockText").forEach(function (item) {
        item.innerText = "Bloqués";
    });
    document.querySelectorAll("#searchText").forEach(function (item) {
        item.innerText = "Recherche";
    });
    document.querySelectorAll("#friendsText").forEach(function (item) {
        item.innerText = "Amis";
    });
    document.getElementById("sidebarF").innerText = "A";
    document.getElementById("sidebarB").innerText = "B";
    document.getElementById("sidebarS").innerText = "R";

}

if (language == "TR")
    TRlangue();
else if (language == "FR")
    FRlangue();

function chatJs() {
    let loca = window.location;
    let friendName = '';

    if (loca.protocol === 'https:') {
        wsStart = 'wss://';
    } else {
        wsStart = 'ws://';
    }
    let endpoint = wsStart + loca.host + "/";
    let socket;
    try {
        socket = new WebSocket(endpoint);

    } catch (error) {
        console.log('error', error);
    }

    var activeConversation = '';
    const userName = document.querySelector('.userName').id;

    socket.onopen = function (e) {
        console.log('onopen', e.data);
    }

    addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            document.querySelector(activeConversation).querySelector('.conversation-form-submit').click();
        }
    });

    socket.onmessage = function (e) {
        console.log('onmessage', e.data);
        const data = JSON.parse(e.data);
        if (data.action === 'pong_request') {
            if (data.update) {
                pong_request(data.username, data.friend, data.update);
            }
        } else if (data.action === 'chat_message') {
            if (data.status) {
                new_message(data.from, data.to, data.msg, data.date);
            } else {
                if (data.from === userName) {
                    alert(data.error);
                }
            }
        } else if (data.action === 'block_user') {
            if (data.status) {
                if (data.alert) {
                    removeFriendHtml(data.block);
                }
                addBlockuserHtml(data.block);
            } else {
                alert(data.error);
            }
        } else if (data.action === 'friend_request') {
            if (data.status) {
                addFriendHtml(data.friend);
            } else {
                alert(data.error);
            }
        }
    }
    socket.onerror = function (e) {
        console.log('onerror', e);
    }
    socket.onclose = function (e) {
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
        head.append('Authorization', getCookie('access_token')) // new
        await fetch(window.location.origin + '/api/ponginviteput/' + username, {
            method: 'PUT',
            headers: head,
            body: jso,
        })
    }

    function pong_request(username, friend, update) {
        var msgMe = `
<div class="conversation-item-content">
    <div class="conversation-item-wrapper">
        <div class="conversation-item-box">
            <div class="conversation-item-text">
                <p>${username} ${friend}</p>
                <p>${update}</p>
                <div class="conversation-item-time pinvite"></div>
                <span style="color: white;">
                    <a href="" data-pinv${username}="${username}${friend}"
                        style="display: grid; grid-template-columns: repeat(2, 1fr);">
                        <i class="accept" style="color: rgb(25, 255, 101);">&#10003;  </i>
                        <i class="decline" style="color: red;">&#x026D4; </i>
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
        console.log('usernaem', username);
        const user = document.querySelector('#conversation-' + username)
        if (user) {
            console.log('user=', user);
        }
        user.querySelector('.conversation-wrapper').appendChild(game_request)
        document.querySelector('[data-pinv' + username + ']').addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.closest('.accept')) {
                updatePongInvite(username, friend, 1);
            } else if (e.target.closest('.decline')) {
                updatePongInvite(username, friend, 2);
            }
            document.querySelector('[data-pinv' + username + ']').parentElement.innerHTML = `you answered this sheesh`;
        })
    }

    function new_message(from, to, msg) {
        var msgMe = `
<div class="conversation-item-side">
    <img class="conversation-item-image"
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&  ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
        alt="">
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
    <img class="conversation-item-image"
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&  ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
        alt="">
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
            console.log("from==", from);
        } else if (to === userName) {
            div.classList.add('me');
            div.innerHTML += msgFriend;
        }
        document.querySelectorAll('.conversation').forEach(function (item) {
            if (item.classList.contains('active')) {
                // scrollBottom(item);
                console.log('item=', item);
            }
            if ((item.id === "conversation-" + to && userName === from) || (item.id === "conversation-" + from && userName === to)) {
                console.log('conversation wrapper', item.querySelector('.conversation-wrapper'));
                console.log("id==",item.id, `==from==${from}==to==${to}==div==`, div);
                item.querySelector('.conversation-wrapper').appendChild(div);
            }
            // scrollBottom(item.querySelector('.conversation-main'));
        });
    }

    function scrollBottom(item) {
        item.scrollTop = item.scrollHeight;
    }

    // ================================================ Profile Button ========================
    document.querySelectorAll('#profileChatButton').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            let profile = this.parentElement.parentElement.parentElement.id;
            profile = profile.split('-')[1];
            redirectPage('/profile/' + profile);
        });
    });
    // ================================================ Remove Friend Html ========================
    function removeFriendHtml(target) {
        var friends = document.querySelector('#Friends');
        friends = friends.querySelector('.content-messages-list')
        friends.querySelectorAll('li').forEach(function (item) {
            item.querySelectorAll('a').forEach(function (i) {
                if (i.dataset.conversation === "#conversation-" + target) {
                    item.remove();
                }
            });
        });
    }

    // ================================================ Remove Blockuser Html ========================
    function removeBlockuserHtml(target) {
        var blockeds = document.querySelector('#Blockeds');
        blockeds.querySelector('.content-messages-list').querySelectorAll('li').forEach(function (item) {
            item.querySelectorAll('a').forEach(function (i) {
                if (i.dataset.block === target) {
                    item.remove();
                }
            });
        });
    }

    // ================================================ add Blockuser Html ========================
    function addBlockuserHtml(target) {
        var blockeds = document.querySelector('#Blockeds');
        blockeds = blockeds.querySelector('.content-messages-list');
        let li = document.createElement('li');
        let html = `
<a href="" data-block="${target}">
    <img class="content-message-image"
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
        alt="">
    <span class="content-message-info">
        <span class="content-message-name">${target}</span>
    </span>
</a> `
        li.innerHTML += html;
        blockeds.appendChild(li);
        blockeds.lastElementChild.lastElementChild.addEventListener('click', function (e) {
            e.preventDefault();
            var user = this.dataset.block;
            if (user) {
                let stat = confirm("You sure unblock the " + user)
                if (stat) {
                    socket.send(JSON.stringify({
                        "action": "unblock_user",
                        "block": user,
                        "user": userName
                    }))
                    removeBlockuserHtml(user);
                }
            }
        });
    }
    // ================================================ add Friend Html ========================
    function addFriendHtml(target) {
        let spirisantus = 0;
        document.querySelectorAll('[data-conversation]').forEach(function (item) {
            if (item.dataset.conversation == "#conversation-" + target) {
                alert('this user already friend')
                spirisantus = 1;
            }
        })
        if (spirisantus) {
            return false;
        }
        const li = document.createElement('li');
        var friends = document.querySelector('#Friends');
        friends = friends.querySelector('.content-messages-list');
        let html = `
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
                <button type="button" class="conversation-back">&laquo;</button>
                <div class="conversation-user">
                    <img class="conversation-user-image"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                        alt="">
                    <div>
                        <div class="conversation-user-name">${target}</div>
                        <div class="conversation-user-status online">online</div>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" id="profileChatButton">${target}</button>
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
                <button data-send="#msg-${target}" data-user="${userName}" type="button" id="conversation-form-button"
                    class="conversation-form-button conversation-form-submit"><i>→</i></button>
            </div>
        `
        div.innerHTML = mainArea;
        const cont = document.querySelector('.chat-content');
        let name = div.querySelector('.conversation-user-name').textContent;
        div.querySelector('.conversation-top').lastElementChild.addEventListener('click', function(e) {
            redirectPage('/profile/' + name);
        });
        cont.appendChild(div)
        friends.appendChild(li);
        let conv = document.querySelector('#Friends').querySelector('.content-messages-list');
        let iNeedThisConv = conv.lastElementChild.querySelector("a");
        sendClickEvent(cont.lastElementChild.querySelector('.conversation-form-submit'))
        conversationClickEvent(iNeedThisConv);
        a();
    }
    // ================================================ ========================

    document.querySelectorAll('[data-choise]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            if (e.target.closest('.friend')) {
                let statu = confirm("You sure add the friend " + this.dataset.choise)
                if (statu) {
                    socket.send(JSON.stringify({
                        'action': 'friend_request',
                        'user': userName,
                        'friend': this.dataset.choise,
                    }));
                }
            } else if (e.target.closest('.block')) {
                let statu = confirm("You sure block the user " + this.dataset.choise)
                if (statu) {
                    socket.send(JSON.stringify({
                        "action": "block_user",
                        "user": userName,
                        "block": this.dataset.choise
                    }))
                }
            }
        })
    });

    document.querySelectorAll('[data-block]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            var user = this.dataset.block
            if (user) {
                let stat = confirm("You sure unblock the " + user)
                if (stat) {
                    socket.send(JSON.stringify({
                        "action": "unblock_user",
                        "block": user,
                        "user": userName
                    }))
                    removeBlockuserHtml(user);
                }
            }
        })
    });

    document.querySelectorAll('[data-title]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            document.querySelectorAll('.content-sidebar').forEach(function (i) {
                i.classList.remove('active')
            })
            document.querySelectorAll('[data-title]').forEach(function (i) {
                i.parentElement.classList.remove('active')
            })
            item.parentElement.classList.add('active')
            document.querySelector(this.dataset.title).classList.add('active')
        })
    });

    document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function (e) {
        e.preventDefault()
        if (this.parentElement.classList.contains('active'))
            this.parentElement.classList.remove('active')
        else
            this.parentElement.classList.toggle('active')
    })

    document.querySelectorAll('.conversation-form-input').forEach(function (item) {
        item.addEventListener('input', function () {
            this.rows = this.value.split('\n').length
        })
    })

    var msgAreaSubmit = `<div class="conversation-form-group">
    <textarea class="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
    <!-- <button type="button" class="conversation-form-record"><i class="ri-mic-line"></i></button> -->
</div>
<button type="button" id="conversation-form-button" class="conversation-form-button conversation-form-submit"><i
        class="ri-send-plane-2-line"></i></button>
`
    function conversationClickEvent(item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            document.querySelectorAll('.conversation').forEach(function (i) {
                i.classList.remove('active')
                var user = item.querySelector('.content-message-name').textContent
                friendName = user
                document.querySelector('.conversation-user-name').innerHTML = user
            })
            document.querySelector(this.dataset.conversation).classList.add('active')
            activeConversation = this.dataset.conversation
        })
    }

    document.querySelectorAll('[data-conversation]').forEach(function (item) {
        conversationClickEvent(item);
    })

    function a() {document.querySelectorAll('.conversation-back').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            this.closest('.conversation').classList.remove('active')
            document.querySelector('.conversation-default').classList.add('active')
        })
    })}

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
            var user = this.dataset.user
            var friend = this.dataset.send.split('-')[1]
            var message = this.parentElement.querySelector('textarea').value
            this.parentElement.querySelector('textarea').value = ''
            if (message && friend && user) {
                send_message(user, friend, message);
            }
        })
    }

    document.querySelectorAll('[data-send]').forEach(function (item) {
        sendClickEvent(item);
    })
    a();
}

chatJs();