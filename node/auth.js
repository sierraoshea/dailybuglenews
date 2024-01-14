// auth microservice
const express = require('express');
//const cookieParser = require('cookie-parser');

const app = express();


const { MongoClient } = require ("mongodb");
const uri = "mongodb://host.docker.internal:27017"; 
//const uri="mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3006;

app.use(express.json());
//app.use(cookieParser());


app.listen(port, '0.0.0.0', ()=> console.log(`listening on port ${port}`));

// CREATE aka sign up
app.post('/', async (request, response)=> {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const username = request.body.username;
    const password = request.body.password;

    // create an object to match our voter object in mongo
    const userData = {"firstName": firstName, "lastName": lastName, "username": username, "password": password};
    
    // write to mongo
    try {
        await client.connect();
        await client.db('dailybugle').collection('users')
        .insertOne(userData)
        .then( results => response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});


// login
app.post('/login', async (request, response)=> {
    const username = request.body.username;
    const password = request.body.password;


    // create an object to match our voter object in mongo
    const userData = {"username": username, "password": password};
    
    try {
        await client.connect();
        await client.db('dailybugle').collection('users').findOne(userData)
        .then ( results => {
            if (results !== null){
                response.cookie('loggedIn', "true", { path: '/' });
                response.cookie('firstName', `${results.firstName}`, { path: '/' });
                response.cookie('lastName', `${results.lastName}`, { path: '/' });
                response.cookie('username', `${results.username}`, { path: '/' });

            }
            response.send(results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }

});


// logout
app.post('/logout', async (request, response)=> {   
    // clear cookies
    response.clearCookie('loggedIn');
    response.clearCookie('fullName');

    // clear all cookies
    response.setHeader('Set-Cookie', ['loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT']);

    // Perform any other logout logic
    response.send('Logged out successfully');
    
});


// READ 
app.get('/', async (request, response) => {
    // load user data - READ
    try {
        await client.connect();
        await client.db('dailybugle').collection('users')
        .find()
        .toArray()
        .then ( results => {
            response.send( results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

// READ  -- login
app.get('/login', async (request, response) => {
    // load user data - READ
    try {
        await client.connect();
        await client.db('dailybugle').collection('users')
        .find()
        .toArray()
        .then()
        .then ( results => {
            response.send(results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

// READ  -- logout
app.get('/logout', async (request, response) => {
    // load user data - READ
    try {
        await client.connect();
        await client.db('dailybugle').collection('users')
        .find()
        .toArray()
        .then()
        .then ( results => {
            response.send(results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});