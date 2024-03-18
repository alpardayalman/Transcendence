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
        }
    }
    else if (data.action === 'getBlockeds'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            listUsers(data.blockeds, 'pBlocked-userlist');
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

function sayHello(username) {
    console.log(username);
}

function sendRequestScreen(selectedUser) {
    console.log(selectedUser + "SR");
}

function blockRemoveScreen(selectedUser) {
    console.log(selectedUser + "BR");
}

function chatMessageScreen(selectedUser) {
    console.log(selectedUser + "CM");
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
    console.log("test");
    const username = document.querySelector('.userName').id;
    socket.send(JSON.stringify({
        "action": "getMessage",
        "user": username,
        "friend": "ahmet"
    }))
}

showChats();