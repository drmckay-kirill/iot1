import requests, json, base64, logging

def get_access_token(token_url, client_id, client_secret, user, password):
    logging.info('Request access token in IdM...')
    encoded = client_id+":"+client_secret
    encoded = 'BASIC ' + base64.b64encode(encoded.encode('ascii')).decode("utf-8")
    headers = {'Authorization': encoded, 'Content-Type': 'application/x-www-form-urlencoded'}
    payload = "grant_type=password&username="+ user +"&password=" + password + "&client_id=" + client_id +"&client_secret=" + client_secret
    response = requests.post(url=token_url + '/oauth2/token',
                             data=payload, headers=headers)
    if response.status_code in (201, 200):
        token = json.loads(response.text)['access_token']
        logging.info('TOKEN --- ' + token)
        return token
    else:
        logging.error('GET TOKEN ### ' + response.text)

def main():
    logging.basicConfig(level=logging.DEBUG)
    logging.info('Reading config')
    with open('config.json') as json_data:
        config = json.load(json_data)
    
    oauth_access_token = get_access_token(config['idm_host'], config['client_id'], config['client_secret'], config['sensor_id'], config['sensor_password'])
    config['access_token'] = oauth_access_token

    with open('config.json', 'w') as json_data:
        json.dump(config, json_data, indent=0)

if __name__ == "__main__":
    main()
