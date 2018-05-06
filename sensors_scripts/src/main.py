import requests, json, logging

def main():
    logging.basicConfig(level=logging.DEBUG)
    logging.info('Reading config')
    with open('config.json') as json_data:
        config = json.load(json_data)

    headers = {
        'Content-type': 'application/json',
        'x-auth-token': config['access_token']
    }
    res = requests.get(config['aa_host'] + '/attributes', headers = headers)
    logging.info(res.text)

if __name__ == "__main__":
    main()
