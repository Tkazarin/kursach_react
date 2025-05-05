import requests
from faker import Faker
import string
import random

API_ENDPOINT = 'http://localhost:4000/api/v1/users'
HEADERS = {'Content-Type': 'application/json'}


fake = Faker()

def random_string(length=7):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))


bad_payloads = [
    {"username": "", "name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": "12", "name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": "!!@", "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": "iv", "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": 12345, "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": fake.first_name(), "email": "notanemail", "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": fake.first_name(), "email": "", "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass1", "role": "Admin"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass1", "role": "hacker"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "sho", "confirm_password": "sho"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "thisisdiagonal", "confirm_password": "thisisdiagonal"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass2"},
    {"username": random_string(7), "name": fake.first_name(), "email": fake.email(), "password": "pass1"},
    {"name": fake.first_name(), "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "email": fake.email(), "password": "pass1", "confirm_password": "pass1"},
    {"username": random_string(7), "name": fake.first_name(), "password": "pass1", "confirm_password": "pass1"},
]

def main():
    print("Fuzzing endpoint:", API_ENDPOINT)
    for id_x, payload in enumerate(bad_payloads):
        response = requests.post(API_ENDPOINT, json=payload, headers=HEADERS)
        print(f"Тест #{id_x+1}")
        print("Payload:", payload)
        print("Status code:", response.status_code)
        if response.status_code == 500:
            print("500 Internal Server Error — Нужно исправить backend!")
        else:
            print("Нет 500, ошибки обработаны корректно")
        print("---")

if __name__ == "__main__":
    main()