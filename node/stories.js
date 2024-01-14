// stories microservice
const express = require('express');

const app = express();


const { MongoClient } = require ("mongodb");
const uri = "mongodb://host.docker.internal:27017"; 
//const uri="mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3007;

app.use(express.json());

app.listen(port, "0.0.0.0", ()=> console.log(`listening on port ${port}`));


// READ 
app.get('/', async (request, response) => {
    // load user data - READ
    try {
        await client.connect();
        await client.db('dailybugle').collection('stories')
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


// CREATE 
app.post('/', async (request, response)=> {
    const headline = request.body.headline;
    const storyBody = request.body.storyBody;
    const teaser = request.body.teaser;
    const categoryList = request.body.categoryList;
    const title = request.body.title;
    const username = request.body.username;
    const created = request.body.created;
    const edited = request.body.edited;
    const comments = request.body.comments;


    // create an object to match our voter object in mongo
    const storyData = {"headline": headline, "storyBody": storyBody, "teaser": teaser, "categoryList": categoryList, "title": title, "username": username, "created": created, "edited": edited, "comments": comments};
    
    // write to mongo
    try {
        await client.connect();
        await client.db('dailybugle').collection('stories')
        .insertOne(storyData)
        .then( results => response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});


// UPDATE
app.put('/', async ( request, response) => {
    // editing entire 
    const headline = request.body.headline;
    const storyBody = request.body.storyBody;
    const teaser = request.body.teaser;
    const categoryList = request.body.categoryList;
    const title = request.body.title;
    const created = request.body.created;
    const username = request.body.username;
    const comments = request.body.comments;
    const edited = request.body.edited;

    const storyFilter = {"title": request.body.title}
    const updateDocument = {$set : { 
        "headline": headline,
        "storyBody": storyBody,
        "teaser": teaser,
        "categoryList": categoryList,
        "title": title,
        "created": created,
        "edited": edited,
        "username": username,
        "comments": comments,
    }}
    try{
        await client.connect();
        await client.db('dailybugle').collection('stories')
        .updateOne(storyFilter, updateDocument)
        .then( results=> response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
})


// DELETE
app.delete('/', async (request,response) => {
    const storyFilter = { "title": request.body.title };
    try {
        await client.connect();
        await client.db('dailybugle').collection('stories')
        .deleteOne(storyFilter)
        .then( results=> response.send(results))
        .catch( error=>console.error(error));
    } catch(error) {
        console.error(error);
    } finally {
        client.close();
    }

})

