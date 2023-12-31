import express from 'express';
import mongo from 'mongodb';
import connect from './db.js';
import auth from './auth.js';
import cors from "cors";
   
const app = express();
const port = 3000;

app.use(cors({
    origin: ["https://monu-seven.vercel.app", "http://localhost:8081"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
}));

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


});

//dohvat slika
app.get('/posts', async (req,res) => {
let db = await connect();

let cursor = await db.collection('posts').find();
let posts = await cursor.toArray();

res.json(posts);

});


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

//dodavanje na favorites
app.post('/favorites', async (req, res) => {
    let db = await connect();
    let lista = req.body;
    try {
      
        //await db.collection('lista').createIndex({[lista.image]:1, [lista.user]:1}, {unique: true});
        let result = await db.collection('lista').insertOne(lista);

        if (result.insertedCount == 1) {
            res.send({
                status: 'success',
                id: result.insertedId,
            });
        } else {
            res.send({
                status: 'crashed',
            });
        }
    } catch (error) {
        if (error.code === 11000) {
            res.send({
                status: 'crashed',
                message: 'Already added',
            });
        } else {
            console.error('Error: ', error);
            res.send({
                status: 'crashed',
            });
        }
    }
});


//popis znamenitosti na stranici My favorites

app.get('/favorites/:user', async (req, res) => {
    let user = req.params.user;
    let db = await connect();
    let document = await db.collection('lista').find({user:user});
    let results = await document.toArray();

    res.json(results)

});


app.get('/', async (req, res) => {
    res.status(200).json({status: "working"})
});

//brisanje slike iz favorita
app.get('/favorites/delete/:image', async (req, res) => {
    let image = req.params.image;
    let imagereal = atob(image)
    let db = await connect();
    let result = await db.collection('lista').deleteOne({"image":imagereal});
    if (result && result.deletedCount === 1) {
        res.json(result);
      } else {
        res.json({
          status: "crashed",
        });
      }
});



app.listen(port, () => console.log("Slušam na portu: ", port));
