// ads microservice
const express = require('express');

const app = express();

const { MongoClient } = require ("mongodb");
const uri = "mongodb://host.docker.internal:27017"; 
//const uri="mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3008;

app.use(express.json());

app.listen(port, "0.0.0.0", ()=> console.log(`listening on port ${port}`));

// READ 
app.get('/', async (request, response) => {
    // load user data - READ
    try {
        await client.connect();
        await client.db('dailybugle').collection('ads')
        .find()
        .toArray()
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



// UPDATE
app.put('/', async ( request, response) => {
    // editing entire 
    const clicks = request.body.clicks;
    const views = request.body.views;
    const img = request.body.img;

    const adFilter = {"img": request.body.img}
    const updateAd = {$set : { 
        "clicks": clicks,
        "views": views,
        "img": img
    }}
    try{
        await client.connect();
        await client.db('dailybugle').collection('ads')
        .updateOne(adFilter, updateAd)
        .then( results=> response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
})


