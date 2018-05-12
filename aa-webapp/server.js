var express = require('express');
var OAuth2 = require('./oauth2').OAuth2;
var config = require('./config');
var session = require('express-session');
var http = require("http");
var moment = require('moment');
const title = "TEST";

// Express configuration
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(session({
    secret: "iwuhowmcgumncgifkcxmifgrxnwungxe",
    resave: true,
    saveUninitialized: true
}));
app.set("view engine", "ejs");
app.configure( () => {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Config data from config.js file
var client_id = config.client_id;
var client_secret = config.client_secret;
var idmURL = config.idmURL;
var response_type = config.response_type;
var callbackURL = config.callbackURL;

function getJSON (rest, method, access_token, onResult) {
    var options = {
        host: config.backend_host,
        port: config.backend_port,
        path: rest,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': access_token
        }
    };
    
    var req = http.request(options, (res) => {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
    });

    req.end();
};

function renderVariables() {
    return {
        "moment": moment,
        "title": title,
        "access_token": "",
        "displayName": undefined,
        "email": undefined,
        "attributes": [],
        "orders": []
    }  
};

// Creates oauth library object with the config data
var oa = new OAuth2(client_id,
                    client_secret,
                    idmURL,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    callbackURL);

// Handles requests to the main page
app.get('/', (req, res) => {
    // If auth_token is not stored in a session cookie it sends a button to redirect to IDM authentication portal 
    if(!req.session.access_token) {
        res.render("login", {
            "title":  title
        });
    } else {
        renderStructure = renderVariables();
        renderStructure.access_token = req.session.access_token;
        res.render("index", renderStructure);
    }
});

// Handles requests from IDM with the access code
app.get('/login', (req, res) => {
    if (req.query.code) {
        // Using the access code goes again to the IDM to obtain the access_token
        oa.getOAuthAccessToken(req.query.code, function (e, results) {
            // Stores the access_token in a session cookie
            req.session.access_token = results.access_token;
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

// Redirection to IDM authentication portal
app.get('/auth', (req, res) => {
    var path = oa.getAuthorizeUrl(response_type);
    res.redirect(path);
});

// Ask IDM for user info
app.get('/user_info', function(req, res){
    if(req.session.access_token) {
        var url = config.idmURL + '/user';

        // Using the access token asks the IDM for the user info
        oa.get(url, req.session.access_token, function (response) {
            var user = JSON.parse(response.data);
            renderStructure = renderVariables();
            renderStructure.access_token = req.session.access_token;
            renderStructure.displayName = user.displayName;
            renderStructure.email = user.email;
            res.render("index", renderStructure);
        });
    } else {
        res.send("Not authenticated", 401);
    }
});

// Handles logout requests to remove access_token from the session cookie
app.get('/logout', function(req, res) {
    req.session.access_token = undefined;
    res.redirect('/');
});

app.get('/attributes', function (req, res) {
    if (req.session.access_token) {
        
        getJSON('/attributes', 'GET', req.session.access_token, function (status, response) {
            renderStructure = renderVariables();
            renderStructure.access_token = req.session.access_token;
            renderStructure.attributes = response;
            res.render("index", renderStructure);          
        });
        
    } else {
        res.send("Not authenticated", 401);
    }
});

app.get('/approvement', function (req, res) {
    if (req.session.access_token) {
        
        getJSON('/secret_key/approvement', 'GET', req.session.access_token, function (status, response) {
            renderStructure = renderVariables();
            renderStructure.access_token = req.session.access_token;
            renderStructure.orders = response;
            res.render("index", renderStructure);          
        });
        
    } else {
        res.send("Not authenticated", 401);
    }
});

app.get('/approvement/new', function (req, res) {
    if (req.session.access_token) {
        
        getJSON('/secret_key/approvement/new', 'GET', req.session.access_token, function (status, response) {
            renderStructure = renderVariables();
            renderStructure.access_token = req.session.access_token;
            renderStructure.orders = response;
            res.render("index", renderStructure);          
        });
        
    } else {
        res.send("Not authenticated", 401);
    }
});

app.listen(80, () => {
    console.log('Server listen in port 80. Connect to localhost...');
});
