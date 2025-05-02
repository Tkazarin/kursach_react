import {useState} from 'react';
import '../styles/EditUser.css';

function EditUserInfoModal({ onClose, onEdited, userInfo }) {
    const [form, setForm] = useState({
        username: userInfo.username || null,
        name: userInfo.name || null,
        email: userInfo.email || null,
        password: null,
        confirm_password: null
    });

    const [error, setError] = useState("");

    function getChangedFields(form, userInfo) {
        const changed = {};
        for (const key in form) {
            // если изменилось и НЕ null, и НЕ ""
            if (
                form[key] !== userInfo[key] &&
                form[key] !== null &&
                form[key] !== ""
            ) {
                changed[key] = form[key];
            }
        }
        return changed;
    }

    function normalizeForm(form) {
        const normalized = {};
        for (const key in form) {
            if (
                (form[key] === "" || form[key] === undefined)
                && (typeof userInfo[key] === "string" || userInfo[key] === null)
            ) {
                normalized[key] = null;
            } else {
                normalized[key] = form[key];
            }
        }
        return normalized;
    }


    function validateUserForm(form) {
        const errors = {};
        if (form.username !== undefined) {
            if (typeof form.username !== 'string' || form.username.trim().length < 3) {
                errors.username = 'Имя пользователя должно быть минимум 3 символа';
            }
        }
        if (form.name !== undefined) {
            if (typeof form.name !== 'string' || form.name.trim().length < 3) {
                errors.name = 'Имя должно быть минимум 3 символа';
            } else if (!/^[A-Za-zА-Яа-яЁё]+$/.test(form.name.trim())) {
                errors.name = 'Имя должно содержать только буквы';
            }
        }
        if (form.email !== undefined) {
            if (typeof form.email !== 'string' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())) {
                errors.email = 'Введите корректный email';
            }
        }
        if (form.password !== undefined) {
            if (typeof form.password !== 'string' || form.password.trim().length < 4) {
                errors.password = 'Пароль должен содержать минимум 4 символа';
            }
            if (typeof form.password === 'string' && form.password.trim().length > 10) {
                errors.password = 'Пароль может содержать максимум 10 символов';
            }
            if (!form.confirm_password) {
                errors.confirm_password = 'Подтвердите пароль';
            }
        }
        if (form.password !== undefined && form.confirm_password !== undefined) {
            if (form.confirm_password !== form.password) {
                errors.confirm_password = 'Пароли не совпадают';
            }
        }
        if (Object.keys(form).length === 0) {
            errors.common = 'Укажите хотя бы одно поле для обновления';
        }
        const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'name'];
        const invalidFields = Object.keys(form).filter(key => !allowUpdates.includes(key));
        if (invalidFields.length > 0) {
            errors.invalid = 'Допустимы только поля: username, password, confirm_password, email, role, name';
        }
        return errors;
    }

    function handleChangeUserInfo(e) {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }


    async function handleSubmit(e) {
        e.preventDefault();

        const errors = validateUserForm(form);
        if (Object.keys(errors).length > 0) {
            alert(
                Object.values(errors).join('\n')
            );
            return;
        }

        const token = localStorage.getItem('token');

        const normalizedForm = normalizeForm(form);
        const changedFields = getChangedFields(normalizedForm, userInfo);

        try {
            const response = await fetch(`http://localhost:4000/api/v1/users/${userInfo.id_user}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(changedFields)
            });
            if (!response.ok) {
                const err = await response.json();
                setError(err.message || "Ошибка! Проверьте поля.");
                return;
            }
            const data = await response.json();
            onEdited(data);

            setForm(
                {
                    username: userInfo.username || null,
                    name: userInfo.name || null,
                    email: userInfo.email || null,
                    password: null,
                    confirm_password: null
                }
            )
        } catch (e) {
            alert("Ошибка при добавлении: " + e.message);
        }
    }

    return (
        <div className="edit-user-modal-bg">
            <form className="edit-user-modal" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="edit-user-modal-close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >×</button>
                <h2 className="edit-user-modal-title">Редактировать профиль</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={form.name}
                    onChange={handleChangeUserInfo}
                    className="edit-user-modal-field"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Почта"
                    value={form.email}
                    onChange={handleChangeUserInfo}
                    className="edit-user-modal-field"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="{}"
                    value={form.username}
                    onChange={handleChangeUserInfo}
                    className="edit-user-modal-field"
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Новый пароль"
                    value={form.progress}
                    onChange={handleChangeUserInfo}
                    className="edit-user-modal-field"
                />
                <input
                    type="text"
                    name="confirm_password"
                    placeholder="Подвердите новый пароль"
                    value={form.confirm_password}
                    onChange={handleChangeUserInfo}
                    className="edit-user-modal-field"
                />
                <button type="submit" className="edit-user-modal-btn">Добавить</button>
            </form>
        </div>
    );
}

export default EditUserInfoModal;