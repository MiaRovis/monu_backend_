import mongo from "mongodb"

let connection_string = "mongodb+srv://admin:admin@cluster0.t5ngpmk.mongodb.net/?retryWrites=true&w=majority";

let client = new mongo.MongoClient(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let db = null

export default () => {
    return new Promise((resolve, reject) => {

        if (db && client.isConnected()){
            resolve(db)
        }

        client.connect(err => {
            if (err) {
                reject("greška" + err)
            }
            else{
                console.log("uspjeh")
                db = client.db("Monu")
                resolve(db)
            }
        })
    })
}