import mongo from 'mongodb';
import connect from './db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


(async () => {
    db = await connect();
    await db.collection("users").createIndex({username: 1}, {unique: true});
})();

export default  {
    async registerUser(userData){
        let db = await connect();

        let doc = {
            username: userData.username,
            password: await bcrypt.hash(userData.password, 8),
            grad: userData.grad,
        };

        try {
        let result = await db.collection("users").insertOne(doc);
        
        if (result && result.insertedId){
            return result.insertedId;
        }
        
        }

        catch(e) {
            if(e.name == "MongoError" && e.code == 11000){
                throw new Error("User already exists!");
            }
        }
    },
    async authenticateUser(username, password) {
        let db = await connect()
        let user = await db.collection("users").findOne({username: username})
    
        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            
            delete user.password
            let token = jwt.sign(user, "secret", {
                algorithm: "HS512",
                expiresIn: "1 week"
            });
            
            return {
                token, 
                username: user.username
            }
           
        
        } else {
            throw new Error ("cannot authenticate");
        }    
    }
};