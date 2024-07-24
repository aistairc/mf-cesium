
import requests
class MyApp():
    def __init__(self):
        self.URL = "https://dpsdev.aaic.hpcc.jp/pntml/csrf"
        self.URL2 = "https://dpsdev.aaic.hpcc.jp/pntml/login"
        self.URL3 = "https://dpsdev.aaic.hpcc.jp/mf/collections"
        self.token = ""
        self.cookies = ""
    def getCsrt(self):
        rg = requests.request('GET', self.URL)
        self.token = rg.text
        self.cookies = rg.cookies
        print(self.token)
        # return self.rg_token
    # print(rg.headers)
    # print(rg_token)
    # print(rg.)

    def Login(self):

        rp_headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        rp_headers['X-XSRF-TOKEN'] = self.token
        rp_headers['Accept'] = '*/*'
        # print(rp_headers)
        login_data = {'name': 'gsrt4crt', 'password': 'Y]3>F2$//j|4>o2NTT|UB*0u2{Cf7R|HD=8'}
        jar = requests.cookies.RequestsCookieJar()
        jar.set('XSRF-TOKEN', self.token)
        # print(jar)
        rp = requests.request('POST', self.URL2, data=login_data, headers=rp_headers, cookies=jar)
        self.cookies = rp.cookies.get_dict()

        print(rp.headers)
    def getData(self):
        rc_cookies = requests.cookies.RequestsCookieJar()
        rc_cookies.set('SESSION', self.cookies['SESSION'])
        rc_cookies.set('XSRF-TOKEN', self.cookies['XSRF-TOKEN'])
        # rc_cookies = {'Cookie': "SESSION="+a['SESSION']+";"+" XSRF-TOKEN="+a['XSRF-TOKEN']}
        rc_headers = {'X-XSRF-TOKEN': self.cookies['XSRF-TOKEN']}
        rc_headers['Content-Type'] = 'application/json'
        rc_headers['Accept'] = 'application/json'
        # print(rc_cookies)
        # print(rc_headers)
        rc = requests.request('GET', self.URL3, headers=rc_headers, cookies=rc_cookies)

        print(rc.json())

if __name__ == '__main__':
    a = MyApp()
    a.getCsrt()
    a.Login()
    a.getData()