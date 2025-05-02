import {useEffect, useRef, useState} from 'react';
import BookCard from '../components/BookCard';

const S3UploadCard = async (files) => {
    const fileNames = files.map(f => f.name);

    const res = await fetch('http://localhost:4000/api/v2/bucket_work/post_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileNames }),
    });
    if (!res.ok) {
        throw new Error('Не удалось получить upload urls');
    }
    const uploadLinks = await res.json();
    await Promise.all(
        uploadLinks.map(async (item) => {
            const file = files.find(f => f.name === item.fileName)?.file;
            if (!file) return;

            await fetch(item.url, {
                method: 'PUT',
                body: file
            });
        })
    );
};

function MyShelf() {
    const [role, setRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
        title: "",
        author: "",
        size: null,
        description: null,
        progress: null,
        file_img: null,
        file: null
    });

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4000/api/v1/users/whoami', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },

                });
                if (!res.ok) throw new Error('Ошибка авторизации');
                const data = await res.json();
                setRole(data.role);
                setUserInfo(data);


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
                    const booksRes = await fetch('http://localhost:4000/api/v1/shelf/my-books', {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },

                    });
                    const booksList = await booksRes.json();
                    setBooks(booksList);
                    console.log(booksRes);
                }
            } catch (err) {
                setError('Нет доступа');
            }
        };

            fetchInfo();


    },  []);

    function handleChangeBook(e) {
        const { name, value, files } = e.target;
        if (files && files.length) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }

    function validateForm(form) {
        const errors = [];

        if (!form.title || typeof form.title !== 'string' || form.title.trim().length < 3 || form.title.trim().length > 40) {
            errors.push("Название должно быть от 3 до 40 символов.");
        }
        if (!form.author || typeof form.author !== 'string' || form.author.trim().length < 3 || form.author.trim().length > 40) {
            errors.push("Автор должен быть от 3 до 40 символов.");
        }
        if (form.size) {
            if (!Number.isInteger(Number(form.size)) || form.size < 0) {
                errors.push("Количество страниц должно быть целым числом.");
            }
        }
        if (form.progress) {
            if (!Number.isInteger(Number(form.progress)) || form.progress < 0) {
                errors.push("Прогресс должен быть целым числом.");
            }
            if (form.size && Number(form.progress) > Number(form.size)) {
                errors.push("Прогресс не может быть больше количества страниц.");
            }
        }
        if (form.description && (typeof form.description !== "string" || form.description.length > 300)) {
            errors.push("Описание не более 300 символов.");
        }
        return errors;
    }

    function isValidCover(file) {
        if (!file) return false;
        const type = file.type.toLowerCase();
        return type === 'image/png' || type === 'image/jpeg';
    }



    async function handleSubmit(e) {
        e.preventDefault();

        const errors = validateForm(form);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }


        const token = localStorage.getItem('token');
        const nickname = userInfo.username;
        const coverFile = form.file_img;
        const downloadFile = form.file;

        let filesToUpload = [];
        if (coverFile) {
            if (!isValidCover(coverFile)) {
                alert('Обложка должна быть PNG или JPG');
                return;
            }
            filesToUpload.push({
                name: nickname + coverFile.name,
                file: coverFile
            });
        }
        if (downloadFile) {
            filesToUpload.push({
                name: nickname + downloadFile.name,
                file: downloadFile
            });
        }

        if (filesToUpload.length) {
            await S3UploadCard(filesToUpload);
        }

        const dataToSend = {
            ...form,
            file_img: coverFile ? nickname + coverFile.name : '',
            file: downloadFile ? nickname + downloadFile.name : '',
        };

        try {
            const res = await fetch('http://localhost:4000/api/v1/shelf/my-books', {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            if (!res.ok) throw new Error(await res.text());
            setShowAddModal(false);
            const newBooks = await fetch('http://localhost:4000/api/v1/shelf/my-books', {
                headers: { "Authorization": "Bearer " + token }
            }).then(r => r.json());
            setBooks(newBooks);
            setForm(
                {
                    title: "",
                    author: "",
                    size: null,
                    description: null,
                    progress: null,
                    file_img: null,
                    file: null
                }
            )
        } catch (e) {
            alert("Ошибка при добавлении: " + e.message);
        }
    }

    function handleRemoveBook(id) {
        setBooks(prevBooks => prevBooks.filter(b => b.id_book !== id));
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (error) return <div>{error}</div>;

    if (role === 'Admin') {
        return (
            <div>
                <h2>Пользователи</h2>
                <ul>
                    {users.map(u => (
                        <li key={u.id_user}>{u.username} ({u.role})</li>
                    ))}
                </ul>

            </div>
        );
    }

    if (role === 'SuperUser') {
        return (
            <div className="my-shelf-content">
                <div className="profile_my_shelf">
                    <button className="profile-btn_my_shelf profile-edit-btn_my_shelf">
                        <span className="icon_my_shelf icon-edit_my_shelf">{/* Ваш SVG или иконка позже */}</span>
                    </button>
                    <button
                        className="profile-btn_my_shelf profile-logout-btn_my_shelf"
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/shelves';
                        }}
                        title="Выйти"
                    >
                        <span className="icon_my_shelf icon-logout_my_shelf">{/* Ваш SVG или иконка */}</span>
                    </button>

                    <div className="profile-item_my_shelf">{userInfo.name}</div>
                    <div className="profile-item_my_shelf">{userInfo.username}</div>
                    <div className="profile-item_my_shelf">{userInfo.email}</div>
                </div>


                <div className="bookshelf">
                    <div ref={containerRef}></div>
                    <ul style={{ padding: 0, marginBottom: 40 }}>
                        {books && books.length > 0 ? (
                            books.map(b => (
                                <li key={b.id_book} style={{ listStyle: "none" }}>
                                    <BookCard
                                        book={b}
                                        onHidden={() => handleRemoveBook(b.id_book)}
                                    />
                                </li>
                            ))
                        ) : (
                            <li>
                                <p className="prohibited">У вас пока нет книг.</p>
                            </li>
                        )}
                        <li>
                            <button className="add-button" onClick={() => setShowAddModal(true)}>
                                Добавить
                            </button>
                        </li>
                    </ul>
                    {showAddModal && (
                        <div className="add-book-modal-bg">
                            <form className="add-book-modal" onSubmit={handleSubmit}>
                                <button
                                    type="button"
                                    className="add-book-modal-close"
                                    onClick={() => setShowAddModal(false)}
                                    aria-label="Закрыть"
                                >×</button>
                                <h2 className="add-book-modal-title">Новая книга</h2>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Название"
                                    value={form.title}
                                    onChange={handleChangeBook}
                                    className="add-book-modal-field"
                                    maxLength={40}
                                />
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="Автор"
                                    value={form.author}
                                    onChange={handleChangeBook}
                                    className="add-book-modal-field"
                                    maxLength={40}
                                />
                                <input
                                    type="number"
                                    name="size"
                                    placeholder="Кол-во страниц"
                                    value={form.size}
                                    onChange={handleChangeBook}
                                    className="add-book-modal-field"
                                />
                                <input
                                    type="number"
                                    name="progress"
                                    placeholder="Прогресс (стр.)"
                                    value={form.progress}
                                    onChange={handleChangeBook}
                                    className="add-book-modal-field"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Описание (по желанию)"
                                    value={form.description}
                                    onChange={handleChangeBook}
                                    className="add-book-modal-field"
                                    maxLength={300}
                                ></textarea>
                                <div style={{ marginBottom: 12 }}>
                                    <label className="add-book-modal-file-label">Обложка:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="file_img"
                                        onChange={handleChangeBook}
                                        style={{ marginBottom: 8, color: 'var(--add-book-modal-label-color)' }}
                                    />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label className="add-book-modal-file-label">Файл (опционально):</label>
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleChangeBook}
                                        style={{ color: 'var(--add-book-modal-label-color)' }}
                                    />
                                </div>
                                <button type="submit" className="add-book-modal-btn">Добавить</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return <div>Нет доступа</div>;
}

export default MyShelf;
