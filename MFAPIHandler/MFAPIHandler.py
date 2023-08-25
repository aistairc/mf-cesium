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
    base_url = "http://localhost:8085"  # API의 기본 URL로 변경해주세요
    mfapi_handler = MFAPIHandler(base_url)

    # GET 요청 보내기 예시
    get_endpoint = "/collections"  # 실제 API 엔드포인트로 변경해주세요
    # get_params = {"param_key": "param_value"}  # GET 요청에 보낼 쿼리 파라미터
    get_collections_response = mfapi_handler.send_get_request(get_endpoint)
    # print("GET Response:", get_response)
    mf_collections = Munch.fromDict(get_collections_response)
    for each_mf_collection in mf_collections.collections:
        # print(each_mf_collection.id)
        # get_each_mf_collection_endpoint = f"/collection/{each_mf_collection.id}"
        # print(get_each_mf_collection_endpoint)
        # get_mf_response = mfapi_handler.send_get_request(get_endpoint)
        # print(get_mf_response)
        print(each_mf_collection.id)
        # get_delete_mf_response = mfapi_handler.delete_mf_collection(each_mf_collection.id)
        # print(get_delete_mf_response, get_delete_mf_response.headers)
    mf_collections_id = "2d6642b9-f2ef-43f1-bc04-47fa9b29c468"
    get_result = mfapi_handler.get_mf_collection(mf_collections_id)
    print(get_result.json())
    # data_path_1 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/MF-JSON Prism/MovingPoint/mfjson_prism_CubicSample_with_image3.json"
    # data_path_1 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/MF-JSON Trajectory/FeatureCollection/201901_03.en-trajectory.json"
    # data_path_1 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/MF-JSON Prism/MovingPolygon/mfjson_polygon_double_typhoon.json"
    # data_path_1 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/MF-JSON Prism/MovingGeometryCollection/test.json"
    # data_path_1 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/MF-JSON Prism/MovingPoint/mfjson_prism_CubicSample_with_image2.json"
    # data_path_2 = "/Users/wijaecho/Workspace/gitlab/MFAPIHandler/data/test.json"
    # with open(data_path_1, "r") as fp1:
    #     mf_json_data_1 = json.load(fp1)
    # mf_collections_id = "2d6642b9-f2ef-43f1-bc04-47fa9b29c468"
    # for i in range(1):
    #     a = mfapi_handler.post_mf_collection(collection_id=mf_collections_id, json_data=mf_json_data_1)
    #     print(a.status_code)
    #     print(a.headers)
    #     print(a.json())
    #     print(a.links)









    # # POST 요청 보내기 예시
    # post_endpoint = "/collection"  # 실제 API 엔드포인트로 변경해주세요
    # post_data = {"key": "value"}  # POST 요청에 보낼 데이터
    # post_response = api_handler.send_post_request(post_endpoint, post_data)
    # print("POST Response:", post_response)
