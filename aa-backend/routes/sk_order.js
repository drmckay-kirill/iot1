var request_lib = require('request');

module.exports = function(app, db) {
    
    app.post('/secret_key/order', function (req, res) {
        console.log('Request for secret key...');
        if (typeof req.body.attributes == "undefined" || req.body.attributes.length == 0) {
            res.send("Empty attributes array", 400)
        }
        device_id = req.headers['x-nick-name']; 
        
        console.log('Cancel last request if it is not approved');
        var details = { 'status': 'new', 'device': device_id };
        var newValues = {$set: { 'status': 'cancel' } };
        db.collection('orders').updateMany(details, newValues, (err, result) => {
            if (err) {
              res.send(err, 400);  
            };
        });

        console.log('Save request in database, it will wait for owner approve');
        secret_key_order = {
            'status': 'new',
            'create_date': Date.now(),
            'attributes': req.body.attributes,
            'user_owner': req.body.user_owner,
            'device': device_id
        };
        db.collection('orders').insert(secret_key_order, (err, result) => {
            if (err) {
                res.send(err, 400);
            } else {
                res.send(result.ops[0]);
            };
        });
        
    });

    app.get('/secret_key/order', function (request, response) {
        console.log('Request all orders...');
        var details = { 'device': request.headers['x-nick-name'] };
        db.collection('orders').find(details).toArray((err, res) => {
            if (err) {
                response.send(err, 400);
            } else {
                response.send(res);
            };
        });
    });

    app.get('/secret_key', (request, response) => {
        console.log('Check last order status...');
        res = {
            'error': false,
            'error_text': '',
            'status': '',
            'key': undefined
        };
        device = request.headers['x-nick-name'];
        db.collection('orders').find({ 'device': device }).sort({'create_date':-1}).limit(1).toArray((err, result) => {
            if (err) {
                res.error = true;
                res.error_text = 'Database search error';
                response.send(res, 400);
            } else {
                console.log(result);
                if (result[0].status == 'approve') {
                    
                    request_lib.post({url: 'http://aa-crypto:5000/sk', json: result[0].attributes} , (error, resp, body) => {
                        if (!error && resp.statusCode == 200) {
                            res.key = body;
                            newStatus = 'done';

                            var newValues = {$set: { 'status': newStatus } };
                            db.collection('orders').updateOne({'_id':result[0]._id}, newValues, (err, result) => {
                                if (err) {
                                    res.error = true;
                                    res.error_text = 'Database update error';
                                    response.send(res, 400); 
                                } else {
                                    res.status = newStatus;
                                    response.send(res);
                                }
                            });

                        } else {
                            res.error = true;
                            res.error_text = 'Error on generating cryptographic secret key';
                            console.log(error);
                            response.send(res, 400);
                        }
                    })

                } else {
                    res.status = result[0].status;
                    response.send(res);
                }
            }
        }); 
    });

};