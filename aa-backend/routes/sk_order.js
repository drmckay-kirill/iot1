module.exports = function(app, db) {
    
    app.post('/secret_key/order', function (req, res) {
        console.log('Request for secret key...');
        console.log('Cancel last request if it is not approved');
        console.log('Save request in database, it will wait for owner approve');
        
        if (typeof req.body.attributes == "undefined" || req.body.attributes.length == 0) {
            res.send("Empty attributes array", 400)
        }

        secret_key_order = {
            'status': 'new',
            'create_date': Date.now(),
            'attributes': req.body.attributes,
            'user_owner': req.body.user_owner,
            'device': req.headers['x-nick-name']
        };
        
        db.collection('orders').insert(secret_key_order, (err, result) => {
            if (err) {
                res.send(err, 400);
            } else {
                res.send(result.ops[0]);
            }
        })
        
    });
};