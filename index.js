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
    const ordersCollection = client.db("travel_guide").collection("orders");


    // added service as new------------------------------
    app.post("/addServices", (req, res) => {
        servicesCollection.insertOne(req.body).then((result) => {
            res.send(result.insertedId)
        })

    })

    // getting data from db for ui load------------------------
    app.get("/services", async (req, res) => {
        const result = await servicesCollection.find({}).toArray()
        res.send(result);


    })

    app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const services = await servicesCollection.findOne(query);
        // console.log('here', id);
        res.send(services)

    })

    // delete services api-------------
    app.delete("/services/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }

        const result = await servicesCollection.deleteOne(query);
        // console.log('deleted this', result)
        res.send(result)
    })
    // users order managment----------
    app.post("/myorders", async (req, res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json(result);
    })
    app.get("/manageuser", async (req, res) => {
        const result = await ordersCollection.find({}).toArray()

        res.send(result);

    })

    app.delete("/manageuser/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }

        const result = await ordersCollection.deleteOne(query);
        // console.log('deleted this', result)
        res.send(result)
    })
    // my orders management------------
    app.get("/myOrders/:email", async (req, res) => {
        const result = await ordersCollection.find({ email: req.params.email }).toArray();
        res.send(result);
    });

    app.delete("/delteOrder/:id", async (req, res) => {
        const result = await ordersCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });





    // client.close();
});




app.listen(port, () => {
    console.log("running port on", 5000)
})
