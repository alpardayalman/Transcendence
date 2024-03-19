socket.onopen = function (e) {
    console.log('onopen', e.data);
}
socket.onmessage = function (e) {
    console.log('onmessage', e.data);
    const data = JSON.parse(e.data);
    const userName = document.querySelector('.userName').id;
    if (data.action === 'getAllUsers') {
        if (data.status && data.user === userName) {
            listUsers(data.users, 'pAdd-userlist');
        }
    }
    else if (data.action === 'getNotFriends' /* NOT FRIENDS */) {
        if (data.status && data.user === userName) {
            listUsers(data.notFriends, 'pAdd-userlist');
        }
    }
    else if (data.action === 'getFriends'/* FRIENDS */) {
        if (data.status && data.user === userName) {
            listUsers(data.friends, 'plist-userlist');
        }
    }
    else if (data.action === 'getMessage'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            console.log(data.messages);
            displayChat(data.messages, userName);
        }
        else if (data.status == false) {
            document.getElementById("screen-chat-inner").innerHTML = "No messages yet";
        }
    }
    else if (data.action === 'getBlockeds'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            console.log("BLOCKEDS", data.blockeds)
            listUsers(data.blockeds, 'pBlocked-userlist');
        }
    }
    else if (data.action === 'sendMessage'/* MESSAGES */) {
        const friendName = document.getElementById("chat-screen-link").dataset.username;
        if (data.status && data.friend === userName && data.user === friendName) {
            console.log("DATA USER", data.user);
            chatMessageScreen(data.user);
        }
        else if (data.status && data.friend === userName) {
            const options = {
                animation: true,
                delay: 15000,
            };
            document.getElementById('toast-title').innerText = "Message from " + data.user;
            document.getElementById('toast-message').innerText = data.message;
            const toast = new bootstrap.Toast(document.getElementById('EpicToast-chat'), options);
            toast.show();
        } else if (!data.status && data.error && data.user === userName) {
            console.warn(data.error);
            document.getElementById('type-box-message').value = ""; 
        }
    }
    else if (data.action === 'blockUser'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            document.getElementById("screen-chat").hidden = true;
            document.getElementById("screen-block").hidden = true;
            document.getElementById("screen-add").hidden = true;
            document.getElementById('type-box').hidden = true;
            document.getElementById('screen-chat-header').hidden = true;
            showBlocked();
        }
    } else if (data.action === 'unblockUser'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            document.getElementById("screen-chat").hidden = true;
            document.getElementById("screen-block").hidden = true;
            document.getElementById("screen-add").hidden = true;
            document.getElementById('type-box').hidden = true;
            document.getElementById('screen-chat-header').hidden = true;
            showChats();    
        }
    }
}
socket.onerror = function (e) {
    console.log('onerror', e);
}
socket.onclose = function (e) {
    console.log('onclose', e);
}

function showChats()/* FRIENDS */ {
    document.getElementById("pBlocked").hidden = true;
    document.getElementById("pAdd").hidden = true;
    document.getElementById("plist").hidden = false;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getFriends",
        "user": username
    }))
}

function showAdd()/* NOT FRIENDS */ {
    document.getElementById("pBlocked").hidden = true;
    document.getElementById("pAdd").hidden = false;
    document.getElementById("plist").hidden = true;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getNotFriends",
        "user": username
    }))
}

function showBlocked() {
    document.getElementById("pBlocked").hidden = false;
    document.getElementById("pAdd").hidden = true;
    document.getElementById("plist").hidden = true;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getBlockeds",
        "user": username
    }))
    
}

function sendRequestScreen(selectedUser) {
    console.log(selectedUser + "SR");

    document.getElementById("screen-chat").hidden = true;
    document.getElementById("screen-block").hidden = true;
    document.getElementById("screen-add").hidden = false;
    document.getElementById('type-box').hidden = true;

    const username = document.querySelector('.userName').id;
    document.getElementById("chat-screen-link").dataset.username = selectedUser;
    document.getElementById('screen-chat-header').hidden = true;

    const message = 
    `<li class="clearfix">
        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
        <div class="about">
            <div class="name">${selectedUser}</div>
            <button onclick="addUser('${selectedUser}')">SEND FRIEND REQUEST</button>                                         
        </div>
    </li>`
    document.getElementById("screen-add").innerHTML = message;
}

function blockRemoveScreen(selectedUser) {
    console.log(selectedUser + "BR");

    document.getElementById("screen-chat").hidden = true;
    document.getElementById("screen-block").hidden = false;
    document.getElementById("screen-add").hidden = true;
    document.getElementById('type-box').hidden = true;

    const username = document.querySelector('.userName').id;
    document.getElementById("chat-screen-link").dataset.username = selectedUser;
    document.getElementById('screen-chat-header').hidden = true;

    const message = 
    `<li class="clearfix">
        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
        <div class="about">
            <div class="name">${selectedUser}</div>
            <button onclick="unblockUser('${selectedUser}')">UNBLOCK</button>                                         
        </div>
    </li>`
    document.getElementById("screen-block").innerHTML = message;
}

function chatMessageScreen(selectedUser) {
    console.log(selectedUser + "CM");

    document.getElementById("screen-chat").hidden = false;
    document.getElementById("screen-block").hidden = true;
    document.getElementById("screen-add").hidden = true;
    document.getElementById('type-box').hidden = false;

    const username = document.querySelector('.userName').id;
    document.getElementById("screen-chat-header-username").innerText = selectedUser;
    document.getElementById('screen-chat-header').hidden = false;
    document.getElementById("chat-screen-link").dataset.username = selectedUser;

    socket.send(JSON.stringify({
        "action": "getMessage",
        "user": username,
        "friend": selectedUser
    }));
}

function goToProfile(ID) {
    const username = document.getElementById("chat-screen-link").dataset.username;
    if (username === "") {
        return ;
    }
    redirectPage('/profile/' + username);
}

function unblockUser(selectedUser) {
    console.log("unblocked User " + selectedUser);

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "unblockUser",
        "user": username,
        "unBlock": selectedUser
    }));
    socket.send(JSON.stringify({
        "action": "getBlockeds",
        "user": username
    }));
}

function addUser(selectedUser) {
    console.log("added User " + selectedUser);
}

function blockUser() {
    const selectedUser = document.getElementById("chat-screen-link").dataset.username;
    if (selectedUser === "") {
        return ;
    }
    const username = document.querySelector('.userName').id;



    socket.send(JSON.stringify({
        "action": "blockUser",
        "user": username,
        "block": selectedUser
    }));
}


async function displayChat(messages, username) {
    console.log("DISPLAY CHAT");
    const chatRoom = document.getElementById("screen-chat-inner");
    const messageLength = messages.length;

    const emptyIncomingMessageBlock = `
    <li class="clearfix">
        <div class="message-data">
            <span class="message-data-time">{{ DATE }}</span>
        </div>
        <div class="message my-message" id="incoming-message-id-{{ ID }}"> {{ MESSAGE }} </div>
    </li>`;
    const emptyUserMessageBlock = `
    <li class="clearfix">
        <div class="message-data text-right">
            <span class="message-data-time">{{ DATE }}</span>
        </div>
        <div class="message other-message float-right" id="message-id-{{ ID }}"> {{ MESSAGE }} </div>
    </li>`;
    chatRoom.innerHTML = "";
    for (let i = 0; i < messageLength; i++) {
        if (messages[i].user === username) {
            let newMessage = emptyUserMessageBlock;
            newMessage = newMessage.replaceAll('{{ DATE }}', messages[i].date);
            newMessage = newMessage.replaceAll('{{ ID }}', i);
            chatRoom.innerHTML += newMessage;
            document.getElementById('message-id-' + i).innerText = messages[i].content;
        }
        else {
            let newMessage = emptyIncomingMessageBlock;
            newMessage = newMessage.replaceAll('{{ DATE }}', messages[i].date);
            newMessage = newMessage.replaceAll('{{ ID }}', i);
            chatRoom.innerHTML += newMessage;
            document.getElementById('incoming-message-id-' + i).innerText = messages[i].content;
        }
    }

    document.getElementById('screen-chat').scrollTop = document.getElementById('screen-chat').scrollHeight;
}

document.addEventListener('keydown', function(event) {
    console.log("KEYDOWN");
    if (event.keyCode === 13) {
        console.log("ENTER");
        typingMessage("type-box-message");
    }
});

function typingMessage(inputID) {
    const input = document.getElementById(inputID);
    const username = document.querySelector('.userName').id;
    const friend = document.getElementById("chat-screen-link").dataset.username;
    const message = input.value;
    console.log("msg==",message);
    if (message === "" || message === null || message === undefined) {
        return ;
    }
    socket.send(JSON.stringify({
        "action": "sendMessage",
        "user": username,
        "friend": friend,
        "message": message
    }));
    input.value = "";
    socket.send(JSON.stringify({
        "action": "getMessage",
        "user": username,
        "friend": friend
    }));
}

function listUsers(users, blockID) {
    const block = document.getElementById(blockID);
    const userList = users;
    const length = users.length;

    let funcSelect;
    if (blockID == 'pAdd-userlist')
        funcSelect = "sendRequestScreen({{ USERNAME }})";
    else if (blockID == 'plist-userlist')
        funcSelect = "chatMessageScreen({{ USERNAME }})";
    else
        funcSelect = "blockRemoveScreen({{ USERNAME }})";

    console.log(length);
    block.innerHTML = "";
    for (let i = 0; i < length; i++)
    {
        const currentName = userList[i];
        const copyFunc = funcSelect.replaceAll('{{ USERNAME }}', "'" + currentName + "'");
        const emptyUserBlock = `
            <li class="clearfix overflow-auto" onclick="${copyFunc}">
                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
                <div class="about">
                    <div class="name">${currentName}</div>                                         
                </div>
            </li> `;
        block.innerHTML += emptyUserBlock;
    }
}

function test() {
    const options = {
        animation: true,
        delay: 15000,
    };
    const toast = new bootstrap.Toast(document.getElementById('EpicToast-invite'), options);
    toast.show();
}
document.getElementById('type-box').hidden = true;
document.getElementById('screen-chat-header').hidden = true;
showChats();