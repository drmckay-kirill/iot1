var express = require('express');
var attributes_list = require('./attributes.json');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(express.json());

app.get('/', function(req, res) {
    res.redirect('/attributes');
});

app.get('/attributes', function (req, res) {
    console.log("Request for attributes list");
    res.send(attributes_list);
});

require('./routes')(app, {});

console.log('Attribute Authority server listen in port 80.');
app.listen(80);
