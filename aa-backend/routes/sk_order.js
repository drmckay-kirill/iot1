module.exports = function(app, db) {
    
    app.post('/secret_key/order', function (req, res) {
        console.log('Request for secret key...');
        console.log('Cancel last request if it is not approved');
        console.log('Save request in database, it will wait for owner approve');
    
        console.log(req.headers);
        console.log(req.body);
        console.log(req.body.user_owner);
        
        secret_key_order = {
            'status': 'new'
        };
        res.send(secret_key_order); 
    });
};