import requests
import random
from faker import Faker

BASE_URL = 'http://localhost:4000/api/v1/shelf'
fake = Faker()

def random_string(length=8):
    return fake.lexify(text='?'*length)

def fuzz_title():
    return random.choice([
        random_string(2),
        random_string(41),
        "",
        fake.name(),
        12345,
        None,
    ])

def fuzz_author():
    return random.choice([
        random_string(2),
        random_string(41),
        fake.name(),
        12345,
        "",
        None,
    ])

def fuzz_size():
    return random.choice([
        random.randint(-5000, 100000),
        random_string(5),
        None,
        "",
        100,
        -5
    ])

def fuzz_description():
    return random.choice([
        random_string(350),
        random_string(10),
        "",
        None,
        123456
    ])

def fuzz_progress(size):
    progress_options = [
        random.randint(-1000, 100000),
        random_string(4),
        "",
        None
    ]
    if size and isinstance(size, int):
        progress_options.append(size + random.randint(1, 5))
        progress_options.append(size - random.randint(1, 5))
        progress_options.append(size)
    return random.choice(progress_options)

def fuzz_file_img():
    return random.choice([None, '', fake.file_name()])

def fuzz_file():
    return random.choice([None, '', fake.file_name()])

def get_auth_token(email, password):
    url = "http://localhost:4000/api/v1/users/login"
    data = {"email": email, "password": password}
    resp = requests.post(url, json=data)
    print('Логин:', resp.status_code, resp.text)
    if resp.status_code == 200 and 'token' in resp.json():
        return resp.json()['token']
    return None

def fuzz_create_book(token):
    url = BASE_URL + '/my-books'
    headers = {"Authorization": "Bearer " + token}
    for i in range(15):
        size = fuzz_size()
        data = {
            "title": fuzz_title(),
            "author": fuzz_author(),
            "size": size,
            "description": fuzz_description(),
            "progress": fuzz_progress(size),
            "file_img": fuzz_file_img(),
            "file": fuzz_file(),
        }
        data = {k: v for k, v in data.items() if v is not None}
        print(f"Тест {i+1}: {data}")
        resp = requests.post(url, json=data, headers=headers)
        print("Статус:", resp.status_code, "Ответ:", resp.text[:200])
        print("-" * 40)

def fuzz_get_book_by_id(token):
    # Тест получения случайного/несуществующего id
    url = BASE_URL + f"/{random.randint(10000, 20000)}"
    headers = {"Authorization": "Bearer " + token}
    resp = requests.get(url, headers=headers)
    print(f"GET /:id_book [{url}] =>", resp.status_code, resp.text[:200])

def fuzz_patch_book(token):
    # Патчим несуществующую книгу
    url = BASE_URL + f"/{random.randint(10000, 20000)}"
    headers = {"Authorization": "Bearer " + token}
    payload = {"title": fuzz_title()}
    resp = requests.patch(url, json=payload, headers=headers)
    print(f"PATCH /:id_book [{url}] =>", resp.status_code, resp.text[:200])

def fuzz_delete_book(token):
    url = BASE_URL + f"/{random.randint(10000, 20000)}"
    headers = {"Authorization": "Bearer " + token}
    resp = requests.delete(url, headers=headers)
    print(f"DELETE /:id_book [{url}] =>", resp.status_code, resp.text[:200])

def fuzz_book_looker(token):
    title = fuzz_title()
    url = BASE_URL + f"/book_looker/{title}"
    headers = {"Authorization": "Bearer " + token}
    resp = requests.get(url, headers=headers)
    print(f"GET /book_looker/{title} =>", resp.status_code, resp.text[:200])

if __name__ == "__main__":
    EMAIL = "mew@list.ru"
    PASSWORD = "1234"
    token = get_auth_token(EMAIL, PASSWORD)
    if not token:
        print("Нельзя получить токен, проверь логин/пароль.")
        exit()

    print("Тест создания книг POST")
    fuzz_create_book(token)

    print("\nТест получения несуществующих книг")

    for _ in range(5):
        fuzz_get_book_by_id(token)

    print("\nТест PATCH несуществующих книг")
    for _ in range(3):
        fuzz_patch_book(token)

    print("\nТест DELETE несуществующих книг")
    for _ in range(3):
        fuzz_delete_book(token)

    print("\nТест book_looker по рандомным названиям")
    for _ in range(5):
        fuzz_book_looker(token)
