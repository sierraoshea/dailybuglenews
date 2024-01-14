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


const endpoint = "http://localhost:80/api/stories"

let commentList = []

const addBtn = document.getElementById("addCategoryBtn")

addBtn.addEventListener("click", () => {
    addCategory();
}); 

// href back to main page
const pageTitle = document.getElementById('pageTitle');

pageTitle.addEventListener('click', function(){
    window.location.href = 'home.html'
})

function addCategory() {
    const categoryInput = document.getElementById("categoryInput");
    const categoryList = document.getElementById("categoryList");

    if (categoryInput.value.trim() !== "") {
        // Create a new list item
        const listItem = document.createElement("li");
        listItem.textContent = categoryInput.value;

        // Append the new item to the category list
        categoryList.appendChild(listItem);

        // Clear the input field
        categoryInput.value = "";
    }
}

const editBtn = document.getElementById("editBtn")

editBtn.addEventListener("click", () =>{
    edit();
})

const deleteBtn = document.getElementById("deleteBtn")

deleteBtn.addEventListener("click", () =>{
    deleteStory();
})

function parseCategoryList() {
    const categoryList = document.getElementById("categoryList");
    const categoryItems = categoryList.getElementsByTagName("li");
    
    // Array to store the category names
    const categoryNames = [];

    for (let i = 0; i < categoryItems.length; i++) {
        const categoryName = categoryItems[i].textContent.trim();
        categoryNames.push(categoryName);
    }

    return categoryNames;
}

function redirectHome(){
    window.location.href = 'home.html';
}

function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

async function edit(){
    try {
        let headline = document.getElementById("headline").value;
        let storyBody = document.getElementById("storyBody").value; // Fix the typo here
        let teaser = document.getElementById("teaser").value;
        let categoryList = parseCategoryList();
        let title = document.getElementById("title").value;
        let edited = new Date();

        const dataToSend = {"headline": headline, "storyBody": storyBody, "teaser": teaser, "categoryList": categoryList, "title": title, "created": created, "edited": edited, "username": username, "comments": commentList};
        console.log(dataToSend)


        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            //console.log(response.body)
            window.location.href = `storyView.html?title=${title}`
        } else {
            // Handle non-ok responses
            console.error(`HTTP error! Status: ${response.status}`);
            document.getElementById('errorMessage').innerText = "Error Editing";
        }
    } catch (error) {
        console.error(error);
        document.getElementById('errorMessage').innerText = "Error Editing";
    }
}

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
        commentList = matchingStory.comments
        username = matchingStory.username;
        created = matchingStory.created;
        console.log(username);
        displayStory(matchingStory);
    }).catch(error => console.error(error));
}

function displayStory(matchingStory){
     // Set values for each input field based on the matchingStory
     console.log(matchingStory)
     document.getElementById("headline").value = matchingStory.headline;
     document.getElementById("storyBody").value = matchingStory.storyBody;
     document.getElementById("teaser").value = matchingStory.teaser;
     document.getElementById("title").value = matchingStory.title;

     document.getElementById("title").disabled = true;

 
     // Display categories
     const categoryList = document.getElementById("categoryList");
     categoryList.innerHTML = ""; // Clear existing categories
 
     matchingStory.categoryList.forEach(category => {
         const listItem = document.createElement("li");
         listItem.textContent = category;
         categoryList.appendChild(listItem);
     });
}

getStories();

async function deleteStory(){
    const titleParam = getURLParameter('title');

    try{
        const dataToSend = {"title": titleParam}
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        if (response.ok) {
            //console.log(response.body)
            redirectHome();
        } else {
            // Handle non-ok responses
            console.error(`HTTP error! Status: ${response.status}`);
            document.getElementById('errorMessage').innerText = "Error Deleting";
        }
    } catch{
        console.error(error);
        document.getElementById('errorMessage').innerText = "Error Deleting";
    }
}

