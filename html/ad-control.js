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
    const ipAddress = await getClientIpAddress();
    const userId = getOrCreateUserId();


    newClick = {"userId":userId, "broswer": browserName, "ip": ipAddress}
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
    const ipAddress = await getClientIpAddress();

    newView = {"userId":userId, "broswer": browserName, "ip": ipAddress}
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