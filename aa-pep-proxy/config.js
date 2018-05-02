var config = {};

// Used only if https is disabled
config.pep_port = 80;

// Set this var to undefined if you don't want the server to listen on HTTPS
config.https = {
    enabled: false,
    cert_file: 'cert/cert.crt',
    key_file: 'cert/key.key',
    port: 443
};

config.idm = {
	host: 'fiware-idm',
	port: 443,
	ssl: true
}

config.app = {
	host: 'aa',
	port: '80',
	ssl: false // Use true if the app server listens in https
}


// Credentials obtained when registering PEP Proxy in app_id in Account Portal
config.pep = {
	app_id: '6b3007d0-df5d-4307-8f85-006ab08bd588',
	username: 'pep_proxy_269ed426-6ded-4729-ba8a-b5cee10fce91',
	password: 'pep_proxy_d4ae4549-587d-4b24-a83f-8f52720b89e6',
	trusted_apps : ['Attribute Authority']
}

// in seconds
config.cache_time = 300;

// if enabled PEP checks permissions with AuthZForce GE. 
// only compatible with oauth2 tokens engine
//
// you can use custom policy checks by including programatic scripts 
// in policies folder. An script template is included there
config.azf = {
	enabled: false,
	protocol: 'https',
    host: 'auth.lab.fiware.org',
    port: 6019,
    custom_policy: undefined // use undefined to default policy checks (HTTP verb + path).
};

// list of paths that will not check authentication/authorization
// example: ['/public/*', '/static/css/']
config.public_paths = [];

config.magic_key = undefined;

module.exports = config;