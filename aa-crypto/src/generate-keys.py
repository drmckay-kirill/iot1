import json, requests
from ABEAndGates import ABEAndGates

engine = ABEAndGates()
with open('config.json') as json_data:
    config = json.load(json_data)
res = requests.get(config['aa_host'] + '/attributes')
engine.SetAttributesList(res.text)
MK, PK = engine.Setup()
with open('keys/pk.bin', 'wb') as data_file:
    data_file.write(engine.Serialize(PK))            
with open('keys/mk.bin', 'wb') as data_file:
    data_file.write(engine.Serialize(MK))
