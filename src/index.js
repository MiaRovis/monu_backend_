import express from 'express';
import connect from './db.js';
import auth from './auth.js';

const app = express();

app.get('/posts', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("posts").find().sort({postedAt: -1})
    let results = await cursor.toArray()

   res.json(results);
});

app.post("/users", async (req, res) => {

    let user = req.body;

    let id;
    try{
    let id = await auth.registerUser(user);
    }

    catch (e){
        res.status(500).json({error: e.message});
    }

    res.json(user);
   
});



//const port = 3000;

//app.get('/', (req, res) => {

//console.log(req.query)
//res.send('hello u browser')
//console.log("hello u konzolu")

//})

// `

