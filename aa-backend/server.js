var express = require('express');
var attributes_list = require('./attributes.json');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');

var app = express();
app.use(express.json());

MongoClient.connect(config.db_host, (err, database) => {
    if (err) {
        return console.log(err);
    }
    console.log('Connect to MongoDB database.');
    var db = database.db("aa");

    app.get('/', function(req, res) {
        res.redirect('/attributes');
    });    

    app.get('/attributes', function (req, res) {
        console.log("Request for attributes list");
        res.send(attributes_list);
    });

    require('./routes')(app, db);
    
    app.listen(80, () => {
        console.log('Attribute Authority server listen in port 80.');       
    });
})
