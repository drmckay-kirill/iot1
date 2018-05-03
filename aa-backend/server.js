var express = require('express');
var attributes_list = require('./attributes.json');

var app = express();

app.get('/', function(req, res) {
    res.redirect('/attributes'); 
});

app.get('/attributes', function (req, res) {
    console.log("Request for attributes list");
    res.send(attributes_list);
});

console.log('Attribute Authority server listen in port 80.');
app.listen(80);
