import requests
import random
from faker import Faker

BASE_URL = 'http://localhost:4000/api/v1/into_shelf'
fake = Faker()


def random_string(length=8):
    return fake.lexify(text='?'*length)


def fuzz_text():
    return random.choice([
        random_string(2),
        random_string(501),
        "",
        fake.text(max_nb_chars=200),
        12345,
        None,
    ])

def get_auth_token(email, password):
    url = "http://localhost:4000/api/v1/users/login"
    data = {"email": email, "password": password}
    resp = requests.post(url, json=data)
    print('Логин:', resp.status_code, resp.text)
    if resp.status_code == 200 and 'token' in resp.json():
        return resp.json()['token']
    return None

def fuzz_create_opinion(token, book_title):
    url = BASE_URL + f"/{book_title}/opinions"
    headers = {"Authorization": "Bearer " + token}
    for i in range(15):
        data = {
            'text': fuzz_text(),
            'progress': random.choice([None, random.randint(0, 100)])
        }
        data = {k: v for k, v in data.items() if v is not None}
        print(f"Тест {i+1}: {data}")
        resp = requests.post(url, json=data, headers=headers)
        print("Статус:", resp.status_code, "Ответ:", resp.text[:200])
        print("-" * 40)

def fuzz_get_opinions_by_book(token):
    book_title = random_string(5)
    url = BASE_URL + f"/{book_title}/opinions"
    headers = {"Authorization": "Bearer " + token}
    resp = requests.get(url, headers=headers)
    print(f"GET /{book_title}/opinions =>", resp.status_code, resp.text[:200])

def fuzz_patch_opinion(token, book_title):
    opinion_id = random.randint(10000, 20000)
    url = BASE_URL + f"/{book_title}/opinions/{opinion_id}"
    headers = {"Authorization": "Bearer " + token}
    payload = {"text": fuzz_text()}
    resp = requests.patch(url, json=payload, headers=headers)
    print(f"PATCH /{book_title}/opinions/{opinion_id} =>", resp.status_code, resp.text[:200])

def fuzz_delete_opinion(token, book_title):
    opinion_id = random.randint(10000, 20000)
    url = BASE_URL + f"/{book_title}/opinions/{opinion_id}"
    headers = {"Authorization": "Bearer " + token}
    resp = requests.delete(url, headers=headers)
    print(f"DELETE /{book_title}/opinions/{opinion_id} =>", resp.status_code, resp.text[:200])

if __name__ == "__main__":
    EMAIL = "mew@list.ru"
    PASSWORD = "1234"
    token = get_auth_token(EMAIL, PASSWORD)
    if not token:
        print("Нельзя получить токен, проверь логин/пароль.")
        exit()

    book_title = "example_book"

    print("Тест создания мнений POST")
    fuzz_create_opinion(token, book_title)

    print("\nТест получения мнений")
    for _ in range(5):
        fuzz_get_opinions_by_book(token)

    print("\nТест PATCH несуществующих мнений")
    for _ in range(3):
        fuzz_patch_opinion(token, book_title)

    print("\nТест DELETE несуществующих мнений")
    for _ in range(3):
        fuzz_delete_opinion(token, book_title)