module.exports = function(app, db) {

    app.get('/secret_key/approvement', function (request, response) {
        console.log('Request all orders for specific user...');
        var details = { 'user_owner': request.headers['x-nick-name'] };
        db.collection('orders').find(details).toArray((err, res) => {
            if (err) {
                response.send(err, 400);
            } else {
                res.sort(function(a,b) { 
                    return (a.create_date > b.create_date) ? -1 : ((b.create_date > a.create_date) ? 1 : 0);
                });
                response.send(res);
            };
        });
    });

    app.get('/secret_key/approvement/new', function (request, response) {
        console.log('Request orders that should be approved by specific user...');
        var details = { 'user_owner': request.headers['x-nick-name'], 'status': 'new' };
        db.collection('orders').find(details).toArray((err, res) => {
            if (err) {
                response.send(err, 400);
            } else {
                response.send(res);
            };
        });
    });

    app.post('/secret_key/approvement/status', (request, response) => {
        console.log('Update order status...');
        res = {
            "error": false,
            "error_text": ""
        };
        newStatus = request.body.status;
        device = request.body.device;
        user_owner = request.headers['x-nick-name'];
        console.log('Verify parameters');
        if (newStatus != 'approve' && newStatus != 'deny') {
            res.error = true;
            res.error_text = 'Incorrect status';
            response.send(res, 400);
        } else {
            console.log('Find order in database');
            var details = { 'user_owner': user_owner, 'status': 'new', 'device': device };
            db.collection('orders').find(details).toArray((err, result) => {
                if (err) {
                    res.error = true;
                    res.error_text = 'Database search error';
                    response.send(res, 400);
                } else {
                    if (result.length == 1) {

                        console.log('Update order record in database with new status');
                        var newValues = {$set: { 'status': newStatus } };
                        db.collection('orders').updateMany(details, newValues, (err, result) => {
                            if (err) {
                                res.error = true;
                                res.error_text = 'Database update error';
                                response.send(res, 400); 
                            } else {
                                response.send(res);
                            }
                        });

                    } else {
                        res.error = true;
                        res.error_text = 'Record not exists!';
                        response.send(res, 400);
                    }
                };            
            });
        }
    });
    
};