
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


const uploadBtn = document.getElementById("uploadBtn")

uploadBtn.addEventListener("click", () =>{
    upload();
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

async function upload(){
    try {
        let headline = document.getElementById("headline").value;
        let storyBody = document.getElementById("body").value; // Fix the typo here
        let teaser = document.getElementById("teaser").value;
        let categoryList = parseCategoryList();
        let title = document.getElementById("title").value;
        let created = new Date();
        const usernameCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('username='));
        const username = usernameCookie ? usernameCookie.split('=')[1] : '';

        const dataToSend = {"headline": headline, "storyBody": storyBody, "teaser": teaser, "categoryList": categoryList, "title": title, "created": created, "edited": null, "username": username, "comments": []};

        const response = await fetch(endpoint, {
            method: 'POST',
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
            document.getElementById('errorMessage').innerText = "Error Uploading";
        }
    } catch (error) {
        console.error(error);
        document.getElementById('errorMessage').innerText = "Error Uploading";
    }
}



