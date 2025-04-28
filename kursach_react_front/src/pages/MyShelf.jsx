import { useEffect, useState } from 'react';

function MyShelf() {
    const [role, setRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4000/api/v1/users/whoami', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },

                });
                if (!res.ok) throw new Error('Ошибка авторизации');
                const data = await res.json();
                setRole(data.role); // 'Admin', 'SuperUser' и т.п.

                if (data.role === 'Admin') {
                    const usersRes = await fetch('http://localhost:4000/api/v1/users', {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },

                    });
                    const usersList = await usersRes.json();
                    setUsers(usersList);
                    console.log(usersList);
                }

                if (data.role === 'SuperUser') {
                    setUserData(data);
                }
            } catch (err) {
                setError('Нет доступа');
            }
        };
        fetchRole();
    }, );

    if (error) return <div>{error}</div>;

    if (role === 'Admin') {
        return (
            <div>
                <h2>Пользователи</h2>
                <ul>
                    {users.map(u => (
                        <li key={u.id}>{u.username} ({u.role})</li>
                    ))}
                </ul>

            </div>
        );
    }

    if (role === 'SuperUser') {
        return (
            <div>
                <h2>Мои данные</h2>
                <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
        );
    }

    return <div>Нет доступа</div>;
}

export default MyShelf;
