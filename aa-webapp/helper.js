var http = require("http");
const title = "TEST";

exports.Helper = function (backend_host, backend_port, moment) {
    this.backend_host = backend_host;
    this.backend_port = backend_port;
    this.moment = moment;
}

exports.Helper.prototype.getTitle = function() {
    return title;
}

exports.Helper.prototype.renderVariables = function () {
    return {
        "moment": this.moment,
        "title": title,
        "message": undefined,
        "approve_mode": false,
        "access_token": "",
        "displayName": undefined,
        "email": undefined,
        "attributes": [],
        "orders": []
    }  
};

exports.Helper.prototype.getJSON = function (rest, method, access_token, post_data, onResult) {
    var options = {
        host: this.backend_host,
        port: this.backend_port,
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
    
    if (post_data != "") {
        req.write(JSON.stringify(post_data));
    };

    req.end();
}