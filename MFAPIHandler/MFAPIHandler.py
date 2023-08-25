import json
import requests
from munch import Munch
import re

class MFAPIHandler:
    def __init__(self, base_url):
        self.base_url = base_url
    def return_response(self, response):
        if response.status_code == 201 or response.status_code == 200:
            return response.json()
        else:
            return response

    def send_post_request(self, endpoint, data):
        url = self.base_url + endpoint
        response = requests.post(url, json=data)
        return response

    def send_get_request(self, endpoint, params=None):
        url = self.base_url + endpoint
        response = requests.get(url, params=params)
        return response.json()

    def send_put_request(self, endpoint, data):
        url = self.base_url + endpoint
        response = requests.put(url, json=data)
        return response

    def send_delete_request(self, endpoint):
        url = self.base_url + endpoint
        response = requests.delete(url)
        return response

    def delete_mf_collection(self, collection_id):
        endpoint = f"/collections/{collection_id}"
        url = self.base_url + endpoint
        headers = {
            'accept': '*/*',
            'Content-Type': 'application/json',
        }
        response = requests.delete(url, headers=headers)
        return response

    def post_mf_collection(self, collection_id, json_data):
        endpoint = f"/collections/{collection_id}/items"
        url = self.base_url + endpoint
        headers = {
            'accept': '*/*',
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, json=json_data)
        return response

    def get_mf_collection(self, collection_id):
        endpoint = f"/collections/{collection_id}/items"
        url = self.base_url + endpoint
        response = requests.get(url)
        return response

if __name__ == "__main__":
    base_url = "http://localhost:8085"
    mfapi_handler = MFAPIHandler(base_url)

    get_endpoint = "/collections"
    get_collections_response = mfapi_handler.send_get_request(get_endpoint)
    # print("GET Response:", get_response)
    mf_collections = Munch.fromDict(get_collections_response)
    for each_mf_collection in mf_collections.collections:
        print(each_mf_collection.id)









