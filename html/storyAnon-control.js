// check authentication
userAuthenticated = checkUserStatus();
if(userAuthenticated){
    window.location.href = `storyView.html?title=${getURLParameter('title')}`;
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

function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

let endpoint = "http://localhost:80/api/stories"


async function getStories(){
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/JSON',
            'Content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        const titleParam = getURLParameter('title');
        const matchingStory = data.find(story => story.title === titleParam);
        displayStory(matchingStory, data);
    }).catch(error => console.error(error));
}

getStories();

function displayStory(story, stories){
    const storyContainer = document.getElementById("storyContainer");
    
    // clear anything current
    storyContainer.innerHTML = "";

    
    const storyElement = document.createElement("div");
    storyElement.classList.add("story");

    const headlineElement = document.createElement("h1");
    headlineElement.textContent = story.headline;
    storyElement.appendChild(headlineElement);

    const bodyElement = document.createElement("p");
    bodyElement.textContent = story.storyBody;
    storyElement.appendChild(bodyElement);


    const categoryElement = document.createElement("p");
    categoryElement.textContent = "Categories: " + story.categoryList.join(", ");
    storyElement.appendChild(categoryElement);

    const titleElement = document.createElement("p");
    titleElement.textContent = "Title: " + story.title;
    storyElement.appendChild(titleElement);

    const usernameElement = document.createElement("p");
    usernameElement.textContent = "Username: " + story.username;
    storyElement.appendChild(usernameElement);

    const createdElement = document.createElement("p");
    let storydate = new Date(story.created)
    createdElement.textContent = "Date Created: " + storydate;
    storyElement.appendChild(createdElement);

    if(story.edited !== null){
        const editedElement = document.createElement("p");
        let editDate = new Date(story.edited)
        editedElement.textContent = "Date Edited: " + editDate;
        storyElement.appendChild(editedElement);
    }

    const commentsElement = document.createElement("div");
    commentsElement.classList.add("comments");

    storyContainer.appendChild(storyElement);


    // Comments


    const commentContainer = document.getElementById("commentContainer")

    commentContainer.innerHTML = "";

    const commentHeadline = document.createElement("h3");
    commentHeadline.textContent = "Comments";
    commentContainer.appendChild(commentHeadline);

    if (!story.comments.length){
        const noComments = document.createElement("p");
        noComments.textContent = "No comments";
        commentContainer.appendChild(noComments);
    }

    //display
    story.comments.forEach(comment => {
        const commentContainerElement = document.createElement("div");
        commentContainerElement.classList.add("comment-container");

        const commenterElement = document.createElement("p");
        commenterElement.classList.add("commenter-name");
        commenterElement.innerHTML = comment.commenter;
        commentContainerElement.appendChild(commenterElement);

        const commentTextElement = document.createElement("p");
        commentTextElement.classList.add("comment-text");
        commentTextElement.textContent = comment.comment;
        commentContainerElement.appendChild(commentTextElement);

        const commentdateElement = document.createElement("p");
        let commentDate = new Date(comment.date)
        commentdateElement.textContent = commentDate;
        commentdateElement.id = "commentDate"
        commentContainerElement.appendChild(commentdateElement);

        commentContainer.appendChild(commentContainerElement);
    });

    commentContainer.appendChild(commentsElement);

    // buttons
    const buttonContainer = document.getElementById("buttonContainer")

    buttonContainer.innerHTML = "";
    
    // Create and append navigation buttons
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("prevButton");
    prevButton.addEventListener("click", () => navigateToPreviousStory(stories, story.title));
    buttonContainer.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("nextButton");
    nextButton.addEventListener("click", () => navigateToNextStory(stories, story.title));
    buttonContainer.appendChild(nextButton);
}

function navigateToNextStory(allStories, currentTitle) {
    const currentIndex = allStories.findIndex(story => story.title === currentTitle);
    const nextIndex = (currentIndex + 1) % allStories.length;
    const nextStory = allStories[nextIndex];
    updateURLWithNewTitle(nextStory.title);
    displayStory(nextStory, allStories);
}

function navigateToPreviousStory(allStories, currentTitle) {
    const currentIndex = allStories.findIndex(story => story.title === currentTitle);
    const prevIndex = (currentIndex - 1 + allStories.length) % allStories.length;
    const prevStory = allStories[prevIndex];
    updateURLWithNewTitle(prevStory.title);
    displayStory(prevStory, allStories);
}

function updateURLWithNewTitle(newTitle) {
    const currentURL = window.location.href;
    const baseURL = currentURL.split('?')[0];
    window.history.replaceState({}, document.title, `${baseURL}?title=${encodeURIComponent(newTitle)}`);
}

// href back to main page
const pageTitle = document.getElementById('pageTitle');

pageTitle.addEventListener('click', function(){
    window.location.href = 'index.html'
})

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
    const titleParam = getURLParameter('title');



    newClick = {"userId":userId, "broswer": browserName, "articleId": titleParam, "date": dateCreated}
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
    const titleParam = getURLParameter('title');


    newView = {"userId":userId, "broswer": browserName, "articleId": titleParam, "date": dateCreated}
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