import { useState } from 'react';
import {useNavigate} from "react-router-dom";

function UserLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            setMessage('Успешный вход');
            window.location.href = '/my_shelf';
        } else {
            setMessage(data.message || 'Ошибка авторизации');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Вход</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    className="login-input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="login-input"
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button className="login-button" type="submit">Войти</button>
            </form>
            <div className="login-message">{message}</div>
        </div>
    );
}

export default UserLogin;
