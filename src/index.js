import express from 'express';
import mongo from 'mongodb';
import connect from './db.js';
import auth from './auth.js';
import cors from "cors";
   
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get("/secret", [auth.verify], (req, res) => {

    try{
    res.status(200).send("secret " + req.jwt.email);
    } catch (error) {
    res.status(500).json({ error: error.message });
}
});

//upload slika

app.post('/posts', async (req,res) => {
    let db = await connect();
    let monuData = req.body;

    let result = await db.collection('posts').insertOne(monuData);
    if(result.insertedCount == 1){
        res.send({
            status: 'success',
            id: result.insertedId,
        });
    }
    else{
        res.send({
            status: 'fail',
        });
    }
    console.log(result);


})

//registracija
app.post('/user', async(req,res) => {
    let userData = req.body;
    let id;
    try{
        id=await auth.registerUser(userData);
        res.status(200).json({id:id})
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e.message});
    }
});

//prijava
app.post('/login', async(req, res) => {
    let user = req.body;
    let userEmail = user.email;
    let userPassword = user.password;


    try {
        let result = await auth.authenticateUser(userEmail, userPassword);
        res.status(201).json(result);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }

});


app.listen(port, () => console.log("Slušam na portu: ", port));
