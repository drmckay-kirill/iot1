var http = require("http");

exports.Helper = function (backend_host, backend_port) {
    this.backend_host = backend_host;
    this.backend_port = backend_port;
}

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