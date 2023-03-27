function hideModal(modal, backdrop, btn, callback) {
    modal.style.visibility = 'hidden';
    backdrop.style.visibility = 'hidden';
   
    btn.removeEventListener('click', callback);

}

function showModal(modal, backdrop) {
    modal.style.visibility = 'visible';
    backdrop.style.visibility = 'visible';
}

 // modal listeners hide/show 
 function toggleModal(class1, class2, btn, callback) {
        const modal = document.getElementsByClassName(class1)[0];
        const backdrop = document.getElementsByClassName('backdrop')[0];
        const closeBtn = document.getElementById(class2);
        showModal(modal, backdrop)

        closeBtn.addEventListener('click', () => {
            hideModal(modal, backdrop, btn, callback);
        });

        backdrop.addEventListener('click', () => {
            hideModal(modal, backdrop, btn, callback);
        });
}




//////////////////////////////////check-log/////////

// check if user is authorized in localstorage,  if its authorized initialize logout button if not register button and puts listeners
 function isAuthorized() {
    let user = localStorage.getItem('logedInUser');
    const authContainer = document.getElementsByClassName('auth')[0];
    if (user) {
        user = JSON.parse(user);
        authContainer.innerHTML = '';
        const html = `
        <li>
            <span id="usernameHeader">${user.username}</span>
        </li>
        <li>
            <button class='btn-neon' id='logout'>logout</button>
        </li>
        `

        authContainer.insertAdjacentHTML('afterbegin', html);

        document.getElementById('logout').addEventListener('click', logout)
        return true;
    } else {
        const html = `
        <li>
            <button class='btn-neon login'>login</button>
        </li>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <li>
            <button class='btn-neon fill register'>register</button>
        </li>
        `
        authContainer.insertAdjacentHTML('afterbegin', html);
        return false;
    }
}


// deletes users in localstorage and then reloads
function logout() {
    localStorage.removeItem('logedInUser');
    location.reload();
}


/////////////////////////////login///////////////////////////////


 // adds listeners on login button
 function login() {
    const loginBtn = document.getElementsByClassName('login')[0];
    loginBtn.addEventListener('click', listenerLogin);
  
    

}

// login button click functional
function listenerLogin() {
    toggleModal('auth-modal', 'close-login');
    const loginBtn = document.getElementById('authorize');
    
    
    loginBtn.addEventListener('click', () => {
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/users').then(res => {
            return res.json()
        }).then(users => {
            const user = users.filter(user => user.username == username && user.password == password);
            if (user.length > 0) {
                loginUser(username, password);
            } else {
                document.getElementById('error-message').style.display = 'block';
            }
        })
    })
}



// fetch data from db.json and then checks if its exits or not. if exits sets in local storage user if not popup error
function loginUser(username, password) {

    fetch('http://localhost:3000/users').then(res => {
            return res.json()
        }).then(users => {
            const user = users.filter(user => user.username == username && user.password == password);
            if (user.length > 0) {
                localStorage.setItem('logedInUser', JSON.stringify(user[0]));
                location.reload();
            } else {
                document.getElementById('error-message').style.display = 'block';
            }
        })
}





///////////////reginster ////////


 // adds listeners to register button
 function register() {
    const registerBtn = document.getElementsByClassName('register')[0];
    registerBtn.addEventListener('click', listener);
   
    
}

//add lisneners to button and then popup modals
function listener() {
    const registerBtn = document.getElementById('register');
    toggleModal('register-modal', 'close-register', registerBtn, registerCallbackFunc);
    
    registerBtn.addEventListener('click', registerCallbackFunc);
    
}

// if user not exist make registration if not pop up error
function registerCallbackFunc() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
        return
    }

    if (password === confirmPassword) {
        const data = {username: username, password: password};
        fetch('http://localhost:3000/users').then(res => {
            return res.json()
        }).then(users => {
            if (users.filter(user => user.username == username).length == 0) {
                registerUser(data);
            } else {
                document.getElementById('register-error-message').style.display = 'block';
            }
        })
    }
}


// make registration in db and authorize automatically
function registerUser(data) {
    fetch('http://127.0.0.1:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(() => {
        loginUser(data.username, data.password);
    });


}

////////////////////// main///////////



function auth() {
    if (!isAuthorized()) {
        register();
        login();  
    }
}


window.onload = function () {
    auth();
}