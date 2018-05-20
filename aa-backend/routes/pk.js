var request_lib = require('request');

module.exports = function(app) {

    app.get('/public_key', (req, res) => {
        request_lib.get('http://aa-crypto:5000/sk', (error, resp, body) => {
            if (!error && resp.statusCode == 200) {
                res.send(body)
            } else {
                res.send(error, 400)
            }
        })
    })

}