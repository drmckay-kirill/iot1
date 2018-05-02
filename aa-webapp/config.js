var config = {}

config.idmURL = 'http://172.18.1.6:3000';
config.client_id = '6b3007d0-df5d-4307-8f85-006ab08bd588';
config.client_secret = '0e8a40c4-7e3c-413d-be0c-249d7bb46e70';
config.callbackURL = 'http://localhost:80/login';

config.backend_host = 'aa-backend';
config.backend_port = 80;

// Depending on Grant Type:
// Authorization Code Grant: code
// Implicit Grant: token
config.response_type = 'code';

module.exports = config;
