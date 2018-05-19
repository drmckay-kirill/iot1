module.exports = function(app, helper) {
    
    app.get('/attributes', function (req, res) {
        if (req.session.access_token) {
            
            helper.getJSON('/attributes', 'GET', req.session.access_token, "", function (status, response) {
                renderStructure = helper.renderVariables();
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
            
            helper.getJSON('/secret_key/approvement', 'GET', req.session.access_token, "", function (status, response) {
                renderStructure = helper.renderVariables();
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
            
            helper.getJSON('/secret_key/approvement/new', 'GET', req.session.access_token, "", function (status, response) {
                renderStructure = helper.renderVariables();
                renderStructure.access_token = req.session.access_token;
                renderStructure.orders = response;
                renderStructure.approve_mode = true;
                res.render("index", renderStructure);          
            });
            
        } else {
            res.send("Not authenticated", 401);
        }
    });
    
    app.get('/approvement/status', (req, res) => {
        if (req.session.access_token) {
            data = {
                'status': req.query.status,
                'device': req.query.id
            };
            helper.getJSON('/secret_key/approvement/status', 'POST', req.session.access_token, data, function (status, response) {
                renderStructure = helper.renderVariables();
                renderStructure.access_token = req.session.access_token;
                if (status == 200 && response.error == false) {
                    renderStructure.message = "Successfully updated! New order status: " + req.query.status + ".";
                } else {
                    console.log(response);
                    renderStructure.message = "Error on update order event!";
                };
                res.render("index", renderStructure); 
            });
        } else {
            res.send("Not authenticated", 401);
        }
    });

}