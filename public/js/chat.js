var url = window.location.hostname.includes('localhost') 
                ? 'http://localhost:8080/api/auth/'
                : 'https://restserver-nodejs-express-cafe.herokuapp.com/api/auth/';
                
let user = null;
let socket = null;

const textUid = document.querySelector('#textUid');
const textMessage = document.querySelector('#textMessage');
const textMessage2 = document.querySelector('#textMessage2');
const ulActiveUsers = document.querySelector('#ulActiveUsers');
const ulAllMessages = document.querySelector('#ulAllMessages');
const btnOut = document.querySelector('#btnOut');
const privatesChat = document.querySelector('#privatesChat');


const verifyJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp =  await fetch(url + 'renew-token', {
        headers: { 'x-token': token}
    })

    if (resp.status !== 200) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const {user: userDB, token: tokenDB} = await resp.json();

    localStorage.setItem('token', tokenDB);

    user = userDB;

    document.title = user.name; 

    await connectSocket();

};

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    });

    socket.on('receive-messages', drawMessagesList);

    socket.on('users-actives', drawUsersList);

    socket.on('message-private', drawPrivateChats);

};$(this).find('.modal-title').text('Hola!')
});

const drawPrivateChats = ({receiverName, receiverId, chats}) => {

    let messagesHtml = '';

    chats.forEach(chat => {
        messagesHtml += `<li>
            <p>
                <span class="text-primary">
                    ${ chat.name }:
                </span>
                <span>
                    ${ chat.message }
                </span>
            </p>
        </li>`
    });

    $('.modal-title').text(receiverName );
    $('.modal-body #receiverId').val(receiverId)
    $('.modal-body #ulAllMessagesPrivates').html( messagesHtml );
    $('#myModal').modal('show');
    
};

const drawMessagesList = (messages) => {
    let messagesHtml = '';
    messages.forEach(({uid, name, message, date}) => {

        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">
                        ${ name }:
                    </span>
                    <span>
                        ${ message }
                    </span>
                </p>
            </li>
        `
    });

    ulAllMessages.innerHTML = messagesHtml;
}

const drawUsersList = (users) => {
    let usersHtml = '';
    users.forEach(user => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">
                        ${ user.name }
                    </h5>
                    <span class="fs-6 text-muted">
                        ${ user.id }
                    </span>
                </p>
            </li>
        `
    });

    ulActiveUsers.innerHTML = usersHtml;
};


const main = async () => {

    await verifyJWT();

};

main();


textMessage.addEventListener('keyup', ({keyCode}) => {

    if ( keyCode !== 13 ) {
        return;
    }

    const message = textMessage.value.trim();
    const id = textUid.value.trim();

    if (message.length === 0) {
        return;
    }

    socket.emit('send-message', { message, id });
    textMessage.value = '';


});

textMessage2.addEventListener('keyup', ({keyCode}) => {

    if ( keyCode !== 13 ) {
        return;
    }

    const message = textMessage2.value.trim();
    const id = receiverId.value;

    if (message.length === 0) {
        return;
    }

    socket.emit('send-message', { message, id });
    textMessage2.value = '';


});

//const socket = io();