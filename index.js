const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cyq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


async function run() {
    try {
        await client.connect();
        const database = client.db('travelGuru');
        const travelCollection = database.collection('travelArea');

        // GET API 
        app.get('/travelsArea', async(req,res)=>{
            const cursor =travelCollection.find({});
            const tourArea = await cursor.toArray();
            res.send(tourArea);

        })

        // API POST 
        app.post('/travelsArea', async (req, res) => {
            const tourArea = req.body
            const result = await travelCollection.insertOne(tourArea)
            res.json(result)
        })

        // single id details 
        app.get('/travelsArea/:id',async (req,res)=>{
           const id = req.params.id;
           console.log('id oilo',id);
           const query= {_id:ObjectId(id)}
           const tour = await travelCollection.findOne(query);
           res.json(tour)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Port is running')
})

app.listen(port, () => {
    console.log('ai bata ami to coltce', port);
})

