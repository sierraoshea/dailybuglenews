// login control

// check authentication
userAuthenticated = checkUserStatus();
if(userAuthenticated){
    window.location.href = 'home.html';
}

// Check if the user is logged in
function checkUserStatus() {
    const loggedInCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('loggedIn='));
    if (loggedInCookie && loggedInCookie.split('=')[1] === 'true') {
        // User is logged in
        console.log('User is logged in');        
        return true
    } else {
        return false
    }
}

// endpoint 
const endpoint = 'http://localhost:80/api/auth/login'

// buttons
const loginButton = document.getElementById('loginBtn');
const signUpLink = document.getElementById('signUpLink');

loginButton.addEventListener('click', function() {
    login();
});

signUpLink.addEventListener('click', function() {
    window.location.href = 'signup.html';
});

// title href
const pageTitle = document.getElementById('pageTitle');

pageTitle.addEventListener('click', function(){
    window.location.href = 'index.html'
})


// password hashing function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
  
    // Use SubtleCrypto to hash the password with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
    return hashedPassword;
}


// go to homepage if logged in sucessfully
function redirectHome(){
    window.location.href = 'home.html';

}


async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Hash the password
    const hashed = await hashPassword(password);

    // Prepare the data to send
    const dataToSend = { "username": username, "password": hashed };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/JSON',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            const data = await response.json();
            if (data !== null) {
                // Data found, continue with your logic
                //console.log(data);
                redirectHome();
            }
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error(error);
        document.getElementById('errorMessage').innerText = "Incorrect Username or Password";
    }
}
