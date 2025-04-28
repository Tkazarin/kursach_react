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
        if (res.ok) setMessage('Пользователь создан!');
        else setMessage(data.message || 'Ошибка регистрации');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Логин" value={form.username} onChange={handleChange} required />
            <input name="name" placeholder="Name (только латиница, min 3 буквы)" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Пароль (4-10 символов)" value={form.password} onChange={handleChange} required />
            <input name="confirm_password" type="password" placeholder="Подтверждение пароля" value={form.confirm_password} onChange={handleChange} required />
            <button type="submit">Зарегистрироваться</button>
            {message && <div>{message}</div>}
        </form>
    );
}

export default UserSignUp;
