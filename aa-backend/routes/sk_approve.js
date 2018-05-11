module.exports = function(app, db) {

    app.get('/secret_key/approvement', function (request, response) {
        console.log('Request all orders for specific user...');
        var details = { 'user_owner': request.headers['x-nick-name'] };
        db.collection('orders').find(details).toArray((err, res) => {
            if (err) {
                response.send(err, 400);
            } else {
                res.sort(function(a,b) { 
                    return (a.create_date > b.create_date) ? 1 : ((b.create_date > a.create_date) ? -1 : 0);
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

};