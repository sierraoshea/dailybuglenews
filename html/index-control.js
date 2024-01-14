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

const loginButton = document.getElementById('loginBtn');
const signupButton = document.getElementById('signupBtn');

// Add a click event listener to the buttons
loginButton.addEventListener('click', function() {
    // Redirect to the login page
    window.location.href = 'login.html';
});
signupButton.addEventListener('click', function() {
    // Redirect to the signup page
    window.location.href = 'signup.html';
});

console.log(document.cookie)


let endpointStories = "http://localhost:80/api/stories"

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
        buttonElement.href = `storyViewAnon.html?title=${encodeURIComponent(story.title)}`;
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


// incorporating ads
let endpointAds = "http://localhost:80/api/ads"

async function getAds(){
    const response = await fetch(endpointAds, {
        method: 'GET',
        headers: {
            'Accept': 'application/JSON',
            'Content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        displayAd(data)
    })
    .catch(error => console.error(error));
}

getAds();


function displayAd(ads){
    const adContainer = document.getElementById("adContainer");

    adContainer.innerHTML = "";

    // Choose a random ad from the fetched ads
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    //randomAd = ads[0]
    console.log(randomAd)

    // Display the random ad
    const adElement = document.createElement("div");
    adElement.classList.add("ad");

    // Display ad content (e.g., image)
    const adImage = document.createElement("img");
    imageId = randomAd.img
    imageViews = randomAd.views 
    imageClicks = randomAd.clicks
    adImage.src = `img/${randomAd.img}`; 
    adImage.id = "adImg";
    adElement.appendChild(adImage);

    adImage.addEventListener('click', () => {
        trackAdClick(imageId);
    });

    adContainer.appendChild(adElement);

    // Track ad view when the page is loaded
    trackAdView(imageId);

}



async function trackAdClick(adSrc) {
    const userAgent = navigator.userAgent;
    const browserName = getBrowserName(userAgent);
    //const ipAddress = await getClientIpAddress();
    const userId = getOrCreateUserId();
    let dateCreated = new Date();


    newClick = {"userId":userId, "broswer": browserName, "articleId": null, "date": dateCreated}
    imageClicks.push(newClick)

    try{
        dataToSend = {"img": adSrc, "views": imageViews, "clicks": imageClicks}

        const response = await fetch(endpointAds, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
    } catch (error) {
        console.error(error);
    }
    
}


async function trackAdView(adSrc) {
    const userAgent = navigator.userAgent;
    const browserName = getBrowserName(userAgent);
    const userId = getOrCreateUserId();
    //const ipAddress = await getClientIpAddress();
    let dateCreated = new Date();

    newView = {"userId":userId, "broswer": browserName, "articleId": null, "date": dateCreated}
    imageViews.push(newView)

    try{
        dataToSend = {"img": adSrc, "views": imageViews, "clicks": imageClicks}

        const response = await fetch(endpointAds, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
    } catch (error) {
        console.error(error);
    }
    
}

// Function to get the browser name from the user agent string
function getBrowserName(userAgentString) {
    const userAgentLowerCase = userAgentString.toLowerCase();
    
    if (userAgentLowerCase.includes("chrome")) {
        return "Chrome";
    } else if (userAgentLowerCase.includes("firefox")) {
        return "Firefox";
    } else if (userAgentLowerCase.includes("safari")) {
        return "Safari";
    } else if (userAgentLowerCase.includes("edge")) {
        return "Edge";
    } else if (userAgentLowerCase.includes("opera") || userAgentLowerCase.includes("opr")) {
        return "Opera";
    } else {
        return "Unknown";
    }
}

// Function to get or create a unique identifier for non-logged-in users
function getOrCreateUserId() {
    let userId = localStorage.getItem('userId');

    if (!userId) {
        // If userId doesn't exist in localStorage, generate a new one
        userId = generateUniqueId();
        localStorage.setItem('userId', userId);
    }

    return userId;
}

// Function to generate a unique identifier
function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function getClientIpAddress() {
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}