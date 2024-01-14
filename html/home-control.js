
    // check if the user is logged in and if they are not logged in redirect them to the index
    // need to do the same on the story view page and on the upload and edit pages, should not be able to access if not logged in
userAuthenticated = checkUserStatus();
if(!userAuthenticated){
    window.location.href = 'index.html';
}


// Check if the user is logged in
function checkUserStatus() {
    const loggedInCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('loggedIn='));
    if (loggedInCookie && loggedInCookie.split('=')[1] === 'true') {
        // User is logged in
        console.log('User is logged in');
        // You can fetch other cookies like firstName and lastName if needed
        const firstNameCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('firstName='));
        const lastNameCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('lastName='));
        const firstName = firstNameCookie ? firstNameCookie.split('=')[1] : '';
        const lastName = lastNameCookie ? lastNameCookie.split('=')[1] : '';
        document.getElementById("firstName").innerHTML = firstName;
        document.getElementById("lastName").innerHTML = lastName;
        return true
    } else {
        return false
    }
}

let endpointLogout = "http://localhost:80/api/auth/logout"
let endpointStories = "http://localhost:80/api/stories"

const logoutBtn=document.getElementById("logoutBtn");


// Redirects user to the home page after signing up
logoutBtn.addEventListener("click", () => {
    logout();
}); 


// Function to logout and clear cookies
async function logout() {
    // Redirect the user to the logout endpoint
    const response = await fetch(endpointLogout, {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            //clearing the cookies again
            document.cookie.split('; ').forEach(cookie => {
                const cookieParts = cookie.split('=');
                const cookieName = cookieParts[0];
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            });
            // Redirect to the login page or perform other logout-related actions
            window.location.href = 'index.html';
        } else {
            throw new Error('Network response was not ok.');
        }
    }).catch(error => console.error(error));
}


const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", () => {
    window.location.href = "upload.html";
}); 

async function getStories(){
    const response = await fetch(endpointStories, {
        method: 'GET',
        headers: {
            'Accept': 'application/JSON',
            'Content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        stories = data
        displayStories(data)
    })
    .catch(error => console.error(error));
}

getStories();

function displayStories(stories){
    const storyContainer = document.getElementById("storyContainer");
    
    // clear anything current
    storyContainer.innerHTML = "";

    stories.forEach(story => {
        const storyElement = document.createElement("div");
        storyElement.classList.add("story");

        const headlineElement = document.createElement("h3");
        headlineElement.textContent = story.headline;
        headlineElement.classList.add("h3");
        storyElement.appendChild(headlineElement);

        const teaserElement = document.createElement("p");
        teaserElement.textContent = story.teaser;
        storyElement.appendChild(teaserElement);

        const buttonElement = document.createElement("a");  // Use an anchor element
        buttonElement.textContent = "Read More";
        buttonElement.href = `storyView.html?title=${encodeURIComponent(story.title)}`;
        buttonElement.classList.add("read-more");
        storyElement.appendChild(buttonElement);


        storyContainer.appendChild(storyElement);

    })

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredStories = filterStoriesBySearchTerm(stories, searchTerm);
    displayStories(filteredStories);
});

function filterStoriesBySearchTerm(stories, searchTerm) {
    return stories.filter(story => {
        const headlineMatches = story.headline.toLowerCase().includes(searchTerm);
        const teaserMatches = story.teaser.toLowerCase().includes(searchTerm);
        return headlineMatches || teaserMatches;
    });
}