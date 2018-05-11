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

};