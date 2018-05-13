import requests, json, logging

def main():
    logging.basicConfig(level=logging.DEBUG)
    logging.info('Reading config')
    with open('config.json') as json_data:
        config = json.load(json_data)

    logging.info('Check secret key order')
    res = requests.get(config['aa_host'] + '/secret_key', headers = {
        "x-auth-token": config["access_token"]
    })
    logging.info(res.text)

if __name__ == "__main__":
    main()
