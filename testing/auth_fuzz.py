import requests
from faker import Faker
import random
import json

BASE_URL = 'http://localhost:4000/api/v1/users'

fake = Faker()

def random_string(length=8):
    return fake.lexify(text='?'*length)

def register_user():
    temp_password = random_string()
    data = {
        "username": random_string(7),
        "email": fake.email(),
        "password": temp_password,
        "confirm_password": temp_password,
        "name": fake.first_name()
    }
    resp = requests.post(BASE_URL + '/', json=data)
    print('Регистрация:', resp.status_code, resp.text)
    return data, resp

def login_user(email, password):
    data = {
        "email": email,
        "password": password
    }
    resp = requests.post(BASE_URL + '/login', json=data)
    print('Логин:', resp.status_code, resp.text)
    if resp.status_code == 200 and 'token' in resp.json():
        return resp.json()['token']
    return None

def fuzz_authenticated_endpoints(token):
    headers = {'Authorization': 'Bearer ' + token}

    print('Тест GET /')
    resp = requests.get(BASE_URL + '/', headers=headers)
    print(resp.status_code, resp.text)

    print('Тест GET /whoami')
    resp = requests.get(BASE_URL + '/whoami', headers=headers)
    print(resp.status_code, resp.text)

    data = json.loads(resp.text)
    userid = data['id_user']
    nonexistentid = random.randint(10001, 20000)

    print(f'Тест GET несуществующего пользователя /{nonexistentid}')
    resp = requests.get(f'{BASE_URL}/{nonexistentid}', headers=headers)
    print(resp.status_code, resp.text)

    print(f'Тест PATCH несуществующего пользователя /{nonexistentid}')
    payload = {"name": random_string(10)}
    resp = requests.patch(f'{BASE_URL}/{nonexistentid}', headers=headers, json=payload)
    print(resp.status_code, resp.text)

    print(f'Тест DELETE несуществующего пользователя /{nonexistentid}')
    resp = requests.delete(f'{BASE_URL}/{nonexistentid}', headers=headers)
    print(resp.status_code, resp.text)

    print(f'Тест GET собственный профиль /{userid}')
    resp = requests.get(f'{BASE_URL}/{userid}', headers=headers)
    print(resp.status_code, resp.text)

    print(f'Тест PATCH собственный профиль /{userid}')
    payload = {"name": random_string(10)}
    resp = requests.patch(f'{BASE_URL}/{userid}', headers=headers, json=payload)
    print(resp.status_code, resp.text)

    print(f'Тест DELETE собственный профиль /{userid}')
    resp = requests.delete(f'{BASE_URL}/{userid}', headers=headers)
    print(resp.status_code, resp.text)


if __name__ == "__main__":
    reg_data, reg_resp = register_user()
    token = login_user(reg_data["email"], reg_data["password"])
    if token:
        fuzz_authenticated_endpoints(token)
    else:
        print("Token is not obtained, skipping protected endpoints test!")