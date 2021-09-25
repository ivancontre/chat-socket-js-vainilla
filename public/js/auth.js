var url = window.location.hostname.includes('localhost') 
                ? 'http://localhost:8080/api/auth/'
                : 'https://restserver-nodejs-express-cafe.herokuapp.com/api/auth/';

const myForm = document.querySelector('form');

myForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {};

    for (let el of myForm.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(resp => resp.json())
    .then(({ token }) => {

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(error => console.log(error));

})
        
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    var data = {
        id_token
    }

    fetch(url + 'google',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(resp => resp.json())
    .then(({ token }) => {

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(error => console.log(error))
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}


