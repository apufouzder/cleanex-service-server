const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 3040;


const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smblb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    console.log('err', err);
    const serviceCollection = client.db("cleanexService").collection("service");
    const reviewCollection = client.db("cleanexService").collection("review");
    const bookingCollection = client.db("cleanexService").collection("booking");
    const adminCollection = client.db("cleanexService").collection("admins");

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/service/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => {
                res.send(result);
            })
    })


    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        bookingCollection.insertOne(booking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/bookings', (req, res) => {
        const bookings = req.query.email;
        bookingCollection.find({ email: bookings })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/allBookings', (req, res) => {
        bookingCollection.find()
            .toArray((err, result) => {
                res.send(result)
            })
    })

    app.patch('/updateStatus', (req, res) => {
        console.log(req.body.id);
        bookingCollection.updateOne(
            { _id: ObjectId(req.body.id) },
            {
                $set: { 'status': req.body.status }
            }
        )
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
            .catch(err => console.log(err))
    })

    app.delete('/delete/:id', (req, res) => {
        const deleteBooking = req.params.id;
        serviceCollection.deleteOne({ _id: ObjectId(deleteBooking) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/getAdmin', (req, res) => {
        adminCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewCollection.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/review', (req, res) => {
        reviewCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello CleanEx Services!')
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
