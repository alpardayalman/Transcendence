socket.onopen = function (e) {
    
}
socket.onmessage = function (e) {
    
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
            
            displayChat(data.messages, userName);
        }
        else if (data.status == false) {
            document.getElementById("screen-chat-inner").innerHTML = "No messages yet";
        }
    }
    else if (data.action === 'getBlockeds'/* MESSAGES */) {
        if (data.status && data.user === userName) {
            
            listUsers(data.blockeds, 'pBlocked-userlist');
        }
    }
    else if (data.action === 'sendMessage'/* MESSAGES */) {
        const friendName = document.getElementById("chat-screen-link").dataset.username;
        if (data.status && data.friend === userName && data.user === friendName) {
            
            chatMessageScreen(data.user);
        }
        else if (data.status && data.friend === userName) {
            const options = {
                animation: true,
                delay: 5000,
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
    } else if (data.action === 'getFriendReqeusts') {
        if (data.status && data.user === userName) {
            
            listUsers(data.requests, 'pRequest-userlist');
        }
    } else if (data.action === 'sendFriendRequest') {
        
        if (data.status && data.receiver === userName) {
            
            document.getElementById("screen-chat").hidden = true;
            document.getElementById("screen-block").hidden = true;
            document.getElementById("screen-add").hidden = true;
            document.getElementById('type-box').hidden = true;
            document.getElementById('screen-chat-header').hidden = true;
            showAdd();
        } else if (data.status && data.sender === userName) {
            
            
            // listUsers(data.requests, 'pRequest-userlist');
        } else {
            
        }
    } else if (data.action === 'friendRequestPut') {
        if (data.status && data.user === userName) {
            
            document.getElementById("screen-chat").hidden = true;
            document.getElementById("screen-block").hidden = true;
            document.getElementById("screen-add").hidden = true;
            document.getElementById('type-box').hidden = true;
            document.getElementById('screen-chat-header').hidden = true;
            showRequests();
        }
    }
    friendCurrentInvite = data.username;
    if (data.action === 'pongInvite' && data.friend === document.querySelector('.userName').id) {
       
        const options = {
            animation: true,
            delay: 15000,
        };
        const toast = new bootstrap.Toast(document.getElementById('EpicToast-invite'), options);
        toast.show();
    }

}

socket.onclose = function (e) {
    
}

function showChats()/* FRIENDS */ {
    document.getElementById("pBlocked").hidden = true;
    document.getElementById("pAdd").hidden = true;
    document.getElementById("plist").hidden = false;
    document.getElementById("pRequest").hidden = true;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getFriends",
        "user": username
    }))
}

function showRequests()/* FRIENDS REQUESTS */ {
    document.getElementById("pBlocked").hidden = true;
    document.getElementById("pAdd").hidden = true;
    document.getElementById("plist").hidden = true;
    document.getElementById("pRequest").hidden = false;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getFriendReqeusts",
        "user": username
    }))
}

function showAdd()/* NOT FRIENDS */ {
    document.getElementById("pBlocked").hidden = true;
    document.getElementById("pAdd").hidden = false;
    document.getElementById("plist").hidden = true;
    document.getElementById("pRequest").hidden = true;

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
    document.getElementById("pRequest").hidden = true;

    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "getBlockeds",
        "user": username
    }))
    
}

function sendRequestScreen(selectedUser) {
    

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

function friendRequestScreen(selectedUser) {
    

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
            <button onclick="acceptReq('${selectedUser}')">Accept</button>
            <button onclick="declineReq('${selectedUser}')">Decline</button>
        </div>
    </li>`
    document.getElementById("screen-block").innerHTML = message;

}

function goToProfile(ID) {
    const username = document.getElementById("chat-screen-link").dataset.username;
    if (username === "") {
        return ;
    }
    redirectPage('/profile/' + username);
}

function unblockUser(selectedUser) {
    
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

function declineReq(selectedUser) {
    if (selectedUser === "") {
        return ;
    }
    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "friendRequestPut",
        "user": selectedUser,
        "friend": username,
        "requestStatus": false
    }));
    
    document.getElementById("screen-chat").hidden = true;
    document.getElementById("screen-block").hidden = true;
    document.getElementById("screen-add").hidden = true;
    document.getElementById('type-box').hidden = true;
    document.getElementById('screen-chat-header').hidden = true;
    showChats();
}

function acceptReq(selectedUser) {
    if (selectedUser === "") {
        return ;
    }
    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "friendRequestPut",
        "user": selectedUser,
        "friend": username,
        "requestStatus": true
    }));
    
    
    document.getElementById("screen-chat").hidden = true;
    document.getElementById("screen-block").hidden = true;
    document.getElementById("screen-add").hidden = true;
    document.getElementById('type-box').hidden = true;
    document.getElementById('screen-chat-header').hidden = true;
    showChats();
}

function addUser(selectedUser) {
    
    if (selectedUser === "") {
        return ;
    }
    
    const username = document.querySelector('.userName').id;

    socket.send(JSON.stringify({
        "action": "sendFriendRequest",
        "sender": username,
        "receiver": selectedUser
    }));
    
    document.getElementById("screen-chat").hidden = true;
    document.getElementById("screen-block").hidden = true;
    document.getElementById("screen-add").hidden = true;
    document.getElementById('type-box').hidden = true;
    document.getElementById('screen-chat-header').hidden = true;
    showChats();
}

async function displayChat(messages, username) {
    
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

if (sayac === 0) {
    document.addEventListener('keydown', function(event) {
        
        if (event.keyCode === 13) {
            
            typingMessage("type-box-message");
        }
    });
    sayac++;
}

function pAddSearch() {
    const input = document.getElementById("pAdd-search-input");
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("pAdd-userlist");
    const li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        const a = li[i].getElementsByTagName("div")[1];
        const txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].hidden = false;
        }
        else {
            li[i].hidden = true;
        }
    }
}

function pFriendSearch() {
    const input = document.getElementById("plist-search-input");
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("plist-userlist");
    const li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        const a = li[i].getElementsByTagName("div")[1];
        const txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].hidden = false;
        }
        else {
            li[i].hidden = true;
        }
    }
}

function typingMessage(inputID) {
    const input = document.getElementById(inputID);
    const username = document.querySelector('.userName').id;
    const friend = document.getElementById("chat-screen-link").dataset.username;
    const message = input.value;
    
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
    else if (blockID == 'pBlocked-userlist')
        funcSelect = "blockRemoveScreen({{ USERNAME }})";
    else
        funcSelect = "friendRequestScreen({{ USERNAME }})";

    
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
    // const options = {
    //     animation: true,
    //     delay: 15000,
    // };
    // const toast = new bootstrap.Toast(document.getElementById('EpicToast-invite'), options);
    // toast.show();

    socket.send(JSON.stringify({
        "action": "friendRequestPut",
        "user": "Yarki",
        "friend": "admin",
        "requestStatus": true
    }))

}

if (language == "EN")
{
    document.getElementById("showChats-id").innerText = "Friends";
    document.getElementById("showRequests-id").innerText = "Requests";
    document.getElementById("showAdd-id").innerText = "Add";
    document.getElementById("showBlocked-id").innerText = "Blocked";
}
else if (language == "TR")
{
    document.getElementById("showChats-id").innerText = "Arkadaşlar";
    document.getElementById("showRequests-id").innerText = "İstekler";
    document.getElementById("showAdd-id").innerText = "Ekle";
    document.getElementById("showBlocked-id").innerText = "Engellenenler";

}
else
{
    document.getElementById("showChats-id").innerText = "Amies";
    document.getElementById("showRequests-id").innerText = "Demandes";
    document.getElementById("showAdd-id").innerText = "Ajouter";
    document.getElementById("showBlocked-id").innerText = "Bloquée";
}

document.getElementById('type-box').hidden = true;
document.getElementById('screen-chat-header').hidden = true;
showChats();