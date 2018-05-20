import logging, argparse, json, requests
from flask import Flask, request
from ABEAndGates import ABEAndGates

logging.basicConfig(level=logging.DEBUG)

logging.info('Starting ABE service on python3.x/flask...')
logging.info('Creating Attribute Based Encryption object')
engine = ABEAndGates()
logging.info('Reading config')
with open('config.json') as json_data:
    config = json.load(json_data)
logging.info('Getting attributes list')
res = requests.get(config['aa_host'] + '/attributes')
engine.SetAttributesList(res.text)

logging.info("Loading keys from file")
with open('keys/pk.bin', 'rb') as data_file:
    PK = engine.Deserialize(data_file.read()) 
with open('keys/mk.bin', 'rb') as data_file:
    MK = engine.Deserialize(data_file.read())                    
 
logging.info('Starting flask app...')

app = Flask(__name__)

@app.route("/")
def index():
    return "Attribute Authority HTTP Service"

@app.route("/sk", methods=['POST'])
def GenerateSecretKey():
    attr = request.get_json()
    logging.info('Received secret key request for: ' + ' '.join(attr))
    SK = engine.GenerateSecretKey(MK, PK, attr)
    return engine.Serialize(SK)

@app.route("/pk", methods=['GET'])
def PublicKey():
    return engine.Serialize(engine.GetPK())

app.run(host='0.0.0.0', port = 5000, debug = True)
