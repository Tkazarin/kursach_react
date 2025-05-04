import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import '../styles/BookOpinion.css';
import EditBookModal from "../components/EditBook";
import EditOpinionModal from "../components/EditOpinion";
import OpinionCard from "../components/OpinionCard";

async function fetchPresignedUrl(downloadFileName) {
    console.log(downloadFileName);
    try {
        const response = await fetch('http://localhost:4000/api/v2/bucket_work/get_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                downloadFileName: downloadFileName,
            }),
        });

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0].url;
        }
        throw new Error('Не удалось получить ссылку');
    } catch (err) {
        alert('Ошибка получения ссылки для скачивания');
        return null;
    }
}


export default function BookOpinions() {
    const {book_title} = useParams();
    const [role, setRole] = useState(null);
    const [book, setBook] = useState({});
    const [editOpinion, setEditOpinion] = useState(null);
    const [opinions, setOpinions] = useState([]);
    const [error, setError] = useState('');
    const [editBook, setEditBook] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [imgUrl, setImgUrl] = useState("/back-book.png");
    const containerRef = useRef(null);
    const [showAddOpinionModal, setShowAddOpinionModal] = useState(false);
    const [form, setForm] = useState({
        text: null,
        progress: null
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

                if (data.role === 'SuperUser') {
                    const decodedTitle = book_title.replace(/_/g, ' ');
                    const bookRes = await fetch(`http://localhost:4000/api/v1/shelf/book_looker/${decodedTitle}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                    });
                    const book = await bookRes.json();
                    setBook(book);
                    console.log(book);
                    const opinionsRes = await fetch(`http://localhost:4000/api/v1/into_shelf/${decodedTitle}/opinions`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                    });
                    const opinions = await opinionsRes.json();
                    setOpinions(opinions);
                    console.log(opinions);
                }
            } catch (err) {
                setError('Нет доступа');
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function getUrl() {
            if (!book) return;
            if (book.file_img) {
                const url = await fetchPresignedUrl(book.file_img);
                if (url && !cancelled) setImgUrl(url);
            } else {
                setImgUrl("/back-book.png");
            }
        }
        getUrl();
        return () => { cancelled = true; };
    }, [book]);

    function handleRemoveOpinion(id) {
        setOpinions(prevOpinions => prevOpinions.filter(o => o.id_opinion !== id));
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function handleChangeOpinion(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

    }

    function validateForm(form) {
        const errors = [];

        if (!form.text || typeof form.text !== 'string' || form.text.trim().length < 3 || form.text.trim().length > 500) {
            errors.push("Мнение должно быть от 3 до 500 символов.");
        }
        if (form.progress) {
            if (!Number.isInteger(Number(form.progress)) || form.progress < 0) {
                errors.push("Прогресс должен быть целым числом.");
            }
            if (book.size && Number(form.progress) > Number(book.size)) {
                errors.push("Прогресс не может быть больше количества страниц.");
            }
        }
        return errors;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const errors = validateForm(form);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        };
        const token = localStorage.getItem('token');
        const decodedTitle = book_title.replace(/_/g, ' ');

        try {
            const res = await fetch(`http://localhost:4000/api/v1/into_shelf/${decodedTitle}/opinions`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error(await res.text());
            setShowAddOpinionModal(false);
            const newOpinions = await fetch(`http://localhost:4000/api/v1/into_shelf/${decodedTitle}/opinions`, {
                headers: { "Authorization": "Bearer " + token }
            }).then(r => r.json());
            setOpinions(newOpinions);
            setForm(
                {
                    text: null,
                    progress: null
                }
            )
        } catch (e) {
            alert("Ошибка при добавлении: " + e.message);
        }
    }

    if (error) return <div>{error}</div>;

    if (role === 'SuperUser') {
        return (
            <div className="opinion-content">
                <div className="book-profile">
                    <button
                        className="book-profile-btn book-profile-edit-btn"
                        onClick={() => setEditBook(book)}
                        title="Редактировать книгу"
                    >
                        <img src="/edit-2.svg" alt="" style={{ width: 'auto', height: '50px', verticalAlign: 'middle' }}/>
                    </button>

                    <div className="book-info-wrapper">
                        <div
                            className="newbookpic"
                            style={{
                                backgroundImage: `url('${imgUrl}')`
                            }}
                        ></div>
                        <div className="book-info-text">
                            {book.title && <div className="book-title">{book.title}</div>}
                            {book.author && <div className="book-author">{book.author}</div>}
                            {book.size && <div className="book-size">{book.size}</div>}
                            {book.size && book.progress && (
                                <div className="book-progress">Прогресс: {book.progress} из {book.size}</div>
                            )}
                            {book.description && <div className="book-description">{book.description}</div>}
                        </div>
                    </div>

                    <button
                        className="book-profile-btn book-profile-back-btn"
                        onClick={() => { window.location.href = '/my_shelf'; }}
                        title="К полке"
                    >
                        <img src="/book.svg" alt="" style={{ width: 'auto', height: '60px', verticalAlign: 'middle' }}/>
                    </button>
                </div>
                <div className="opinionshelf">
                    <div ref={containerRef}></div>
                    <ul style={{ padding: 0, marginBottom: 10 }}>
                        {opinions && opinions.length > 0 ? (
                            opinions.map(o => (
                                <li key={o.id_opinion} style={{ listStyle: "none" }}>
                                    <OpinionCard
                                        opinion={o}
                                        onHidden={() => handleRemoveOpinion(o.id_opinion)}
                                        onEdit={() => setEditOpinion(o)}
                                        title={book.title}
                                        size={book.size}
                                    />
                                </li>
                            ))
                        ) : (
                            <li>
                                <p className="prohibited">У вас пока нет мнений.</p>
                            </li>
                        )}
                        <li>
                            <button className="add-button-opinion" onClick={() => setShowAddOpinionModal(true)}>
                                <img src="/plus-2.svg" alt="" style={{ width: 'auto', height: '50px', verticalAlign: 'middle' }}/>
                            </button>
                        </li>
                    </ul>
                    {editBook && (
                        <EditBookModal
                            book={editBook}
                            onClose={() => setEditBook(null)}
                            onEdited={async updatedBook => {
                                const token = localStorage.getItem('token');
                                console.log(book.id_book);
                                const newBook = await fetch(`http://localhost:4000/api/v1/shelf/${book.id_book}`, {
                                    headers: { "Authorization": "Bearer " + token }
                                }).then(r => r.json());
                                setBook(newBook);
                                setEditBook(null);
                            }}
                            userInfo={userInfo}
                        />
                    )}
                    {editOpinion && (
                        <EditOpinionModal
                            size={book.size}
                            onClose={() => setEditOpinion(null)}
                            onEdited={async updatedBook => {
                                const token = localStorage.getItem('token');
                                const decodedTitle = book_title.replace(/_/g, ' ');
                                const newOpinions = await fetch(`http://localhost:4000/api/v1/into_shelf/${decodedTitle}/opinions`, {
                                    headers: { "Authorization": "Bearer " + token }
                                }).then(r => r.json());
                                setOpinions(newOpinions);
                                setEditOpinion(null);
                            }}
                            title ={book_title.replace(/_/g, ' ')}
                            opinion={editOpinion}
                        />
                    )}
                    {showAddOpinionModal && (
                        <div className="add-book-modal-bg">
                            <form className="add-book-modal" onSubmit={handleSubmit}>
                                <button
                                    type="button"
                                    className="add-book-modal-close"
                                    onClick={() => {
                                        setShowAddOpinionModal(false);
                                        setForm({
                                            text: null,
                                            progress: null
                                        });
                                    }}
                                    aria-label="Закрыть"
                                >×</button>
                                <h2 className="add-book-modal-title">Новое мнение</h2>
                                <textarea
                                    name="text"
                                    placeholder="Мнение"
                                    value={form.text}
                                    style={{ height: '10vh' }}
                                    onChange={handleChangeOpinion}
                                    className="add-book-modal-field"
                                    maxLength={500}
                                ></textarea>
                                <input
                                    type="numder"
                                    name="progress"
                                    placeholder="Прогресс по чтению"
                                    value={form.progress}
                                    onChange={handleChangeOpinion}
                                    className="add-book-modal-field"
                                />
                                <button type="submit" className="add-book-modal-btn">Добавить</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
