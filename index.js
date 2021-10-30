const express = require("express")
const { MongoClient } = require('mongodb');
const cors = require("cors")
const ObjectId = require("mongodb").ObjectId

require('dotenv').config()
// -------------------------------------
// ----------------App work-----------------------
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// -----------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkykc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

// -----------------------------------------------------


app.get("/", (req, res) => {
    res.send("running port on server")
})

client.connect(err => {
    const servicesCollection = client.db("travel_guide").collection("services");

    // added data as new
    app.post("/addServices", (req, res) => {
        servicesCollection.insertOne(req.body).then((result) => {
            res.send(result.insertedId)
        })
        // console.log(req.body)
    })

    // getting data for ui load------------------------
    app.get("/services", async (req, res) => {
        const result = await servicesCollection.find({}).toArray()
        res.send(result);

    })




    // client.close();
});




app.listen(port, () => {
    console.log("running port on", 5000)
})