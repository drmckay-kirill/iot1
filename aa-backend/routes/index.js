var sk_order = require('./sk_order');
var sk_approve = require('./sk_approve');
var pk = require('./pk');
module.exports = function(app, db) {
    sk_order(app, db);
    sk_approve(app, db);
    pk(app);
};