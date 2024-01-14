// signup control 

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

const endpoint = 'http://localhost:80/api/auth'

// login and signup elements
const loginLink = document.getElementById("loginLink");
const signupBtn = document.getElementById("signupBtn");

// Redirects user to the login page
loginLink.addEventListener("click", () => {
    window.location.href = "login.html";
});



// Redirects user to the home page after signing up
signupBtn.addEventListener("click", () => {
    signup();
}); 

// href back to main page
const pageTitle = document.getElementById('pageTitle');

pageTitle.addEventListener('click', function(){
    window.location.href = 'index.html'
})


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


function redirectLogin(){
    window.location.href = 'login.html';
}

async function signup() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;


    hashPassword(password)
        .then(hashed => {
            console.log('Hashed Password:', hashed);

            const dataToSend = {
                "firstName": firstName, "lastName": lastName,"username": username,"password": hashed };

            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/JSON',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
        })
        .then(response => response.json())
        .then(data => redirectLogin())
        .catch(error => {
            console.error(error);
            document.getElementById('errorMessage').innerText = "Does not meet specifications";
        });
}


// change it so that when you login or signup you access the endpoint and then checks if you it matches then redirects

