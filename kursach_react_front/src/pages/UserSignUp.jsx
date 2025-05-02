import { useState } from 'react';

function UserSignUp() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/v1/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        let data;
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch (err) {
            data = { message: text };
        }
        if (res.ok) {
            // Логиним пользователя сразу после регистрации
            const loginRes = await fetch('http://localhost:4000/api/v1/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                }),
                credentials: 'include'
            });
            const loginData = await loginRes.json();
            if (loginRes.ok) {
                localStorage.setItem('token', loginData.token);
                setMessage('Регистрация успешна! Перенаправление...');
                setTimeout(() => {
                    window.location.href = '/my_shelf';
                }, 1000);
            } else {
                setMessage('Пользователь создан, но вход не выполнен: ' + (loginData.message || 'Ошибка входа'));
            }
        } else {
            setMessage(data.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Регистрация</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    className="register-input"
                    name="username"
                    placeholder="Логин"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    className="register-input"
                    name="name"
                    placeholder="Name (только латиница, min 3 буквы)"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    className="register-input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="register-input"
                    name="password"
                    type="password"
                    placeholder="Пароль (4-10 символов)"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    className="register-input"
                    name="confirm_password"
                    type="password"
                    placeholder="Подтверждение пароля"
                    value={form.confirm_password}
                    onChange={handleChange}
                    required
                />
                <button className="register-button" type="submit">Зарегистрироваться</button>
                {message && <div className="register-message">{message}</div>}
            </form>
        </div>
    );
}

export default UserSignUp;
