import requests, json, logging

def main():
    logging.basicConfig(level=logging.DEBUG)
    logging.info('Reading config')
    with open('config.json') as json_data:
        config = json.load(json_data)

    logging.info('Request attributes list')
    res = requests.get(config['aa_host'] + '/attributes', headers = {
            'x-auth-token': config['access_token']
        }
    )
    logging.info(res.text)

    # logging.info('Request all orders')
    # res = requests.get(config['aa_host'] + '/secret_key/order', headers = {
    #         'x-auth-token': config['access_token']
    #     }
    # )
    # logging.info(res.text)

    logging.info('Request secret key')
    headers = {
        "Content-type": "application/json",
        "x-auth-token": config["access_token"]
    }
    res = requests.post(config['aa_host'] + '/secret_key/order', headers = headers, data = json.dumps({
        "user_owner": "admin",
        "attributes": ["thermometer"]
    }))
    logging.info(res.text)

if __name__ == "__main__":
    main()
