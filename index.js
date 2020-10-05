const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const port = 4000;
const ObjectId = require('mongodb').ObjectID;


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//mongodb
console.log( process.env.DB_PASS);

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfbl4.mongodb.net/uploadfile?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const dbCollection = client.db("uploadfile").collection("data");
    const dbEventUser = client.db("uploadfile").collection("selectedEvent");
    //post method
    app.post('/addNewEvent', (req, res) => {
        const product = req.body;

        dbCollection.insertOne(product)
            .then(result => {
                res.send('your product added');
            })
    });
    app.post('/addUser', (req, res) => {
        const product = req.body;
        dbEventUser.insertOne(product)
            .then(result => {
                res.send('your product added');
            })
    });

    //get method getAllRegister
    app.get('/getAllEvent', (req, res) => {
        dbCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.get('/getAllRegister', (req, res) => {
        dbEventUser.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/myEvent/:email', (req, res) => {
        console.log(req.params.email)
        dbEventUser.find({ email: 'tanvir2972017@gmail.com' })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

  //delete method
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id)

        dbEventUser.deleteOne({ "_id": ObjectId(req.params.id) })
            .then((result) => {
                // console.log(result);
                res.send(result.deletedCount > 0);
            })
    })
});

app.get('/',(req,res) =>{
    res.send('ok im okkkkkk')
})

app.listen(process.env.PORT || port)