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

    def get_mf_collection(self, collection_id, params):
        endpoint = f"/collections/{collection_id}/items"
        url = self.base_url + endpoint
        response = requests.get(url, params=params)
        return response

if __name__ == "__main__":
    base_url = "http://localhost:8085"
    mfapi_handler = MFAPIHandler(base_url)

    # Register the MovingFeature Collection
    default_mf_collection_json = {
        "title": "moving_feature_collection_sample",
        "updateFrequency": 1000,
        "description": "Test"
    }
    post_endpoint = "/collections"
    post_result = mfapi_handler.send_post_request(post_endpoint, default_mf_collection_json)
    if post_result.status_code == 200 or post_result.status_code == 201:
        print(post_result.status_code)
        print(post_result.headers["Location"])

    # Post the MovingFeature data
    test_data_path = "data/test.json"
    with open(test_data_path, "r") as fp1:
        mf_json_data_1 = json.load(fp1)
    mf_collections_id = "2d6642b9-f2ef-43f1-bc04-47fa9b29c468"
    post_mf_result = mfapi_handler.post_mf_collection(collection_id=mf_collections_id, json_data=mf_json_data_1)
    if post_mf_result.status_code == 200 or post_mf_result.status_code == 201:
        print(post_mf_result.status_code)
        print(post_mf_result.headers)

    # Get MovingFeature Collections
    get_endpoint = "/collections"
    get_collections_response = mfapi_handler.send_get_request(get_endpoint)
    mf_collections = Munch.fromDict(get_collections_response)
    for each_mf_collection in mf_collections.collections:
        print(each_mf_collection.id)
        mf_collections_id = each_mf_collection.id
        params = {
            "limit": 10
        }
        get_each_mf = mfapi_handler.get_mf_collection(mf_collections_id, params=params)
        if get_each_mf.status_code == 200 or get_each_mf.status_code == 201:
            print(get_each_mf.json())
            # Get tGeometry

        # get_delete_mf_response = mfapi_handler.delete_mf_collection(each_mf_collection.id)
        # print(get_delete_mf_response, get_delete_mf_response.headers)







