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

//registracija
app.post('/user', async(req,res) => {
    let userData = req.body;
    let id;
    try{
        id=await auth.registerUser(userData);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }
    res.json({id:id})
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
