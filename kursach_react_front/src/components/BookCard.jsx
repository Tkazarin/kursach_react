import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookCard.css';

async function fetchPresignedUrl(downloadFileName) {
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

function BookCard({ book, onHidden, onEdit}) {
    const id_book = book.id_book;
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const [imgUrl, setImgUrl] = useState("/back-book.png");
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function getUrl() {
            if (book.file_img) {
                const url = await fetchPresignedUrl(book.file_img);
                if (url && !cancelled) setImgUrl(url);
            } else {
                setImgUrl("/back-book.png");
            }
        }
        getUrl();
        return () => { cancelled = true; };
    }, [book.file_img]);


    const handleDownload = async (e) => {
        e.preventDefault();
        if (!book.file) return;
        setDownloadLoading(true);


        const presignedUrl = await fetchPresignedUrl(book.file);
        setDownloadLoading(false);

        if (presignedUrl) {
            const link = document.createElement('a');
            link.href = presignedUrl;
            link.download = book.file;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/v1/shelf/${book.id_book}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении на сервере');
            }
            setTimeout(() => {
                setIsHidden(true);
                onHidden && onHidden();
            }, 1500);
        } catch (error) {
            setIsDeleting(false);
            alert('Не удалось удалить книгу на сервере');
        }

    };

    if (isHidden) return null;

    return (
        <div className={`book-card${isDeleting ? ' deleteme' : ''}`}>
        <div
                className="bookpic"
                style={{
                    backgroundImage: `url('${imgUrl}')`
                }}
            ></div>
            <div className="bookinfo">
                <div className="card-title">{book.title}</div>
                <div className="card-author">{book.author}</div>
                {book.description && <div className="card-description">{book.description}</div>}
                {book.size && <div className="card-size">Размер: {book.size}</div>}
                {book.size && book.progress && (
                    <div className="card-progress">Прогресс: {book.progress} из {book.size}</div>
                )}
                <ul className="card-controls">
                    {book.file &&
                        <li className="card-control">
                            <a href="#" onClick={handleDownload}>
                                <img src="/download.svg" alt="" style={{ width: '60px', height: 'auto', verticalAlign: 'middle' }}/>
                                <span className="invisible">{downloadLoading ? 'Загрузка...' : 'Файл'}</span>
                            </a>
                        </li>}
                    <li className="card-control">
                        <button
                            className="icon-btn"
                            onClick={() => onEdit(book)}
                            title="Редактировать"
                        >
                            <img src="/edit-2.svg" alt="" style={{ width: '60px', height: 'auto', verticalAlign: 'middle' }}/>
                            <span className="invisible">Edit</span>
                        </button>
                    </li>
                    <li className="card-control deletebutton">
                        <button
                            className="icon-btn"
                            onClick={handleDelete}
                            title="Удалить"
                        >
                            <svg className="icon icon--2x deletesvg">
                                <use xlinkHref="#delete" />
                            </svg>
                            <img src="/delete-2.svg" alt="" style={{ width: '60px', height: 'auto', verticalAlign: 'middle' }}/>
                        </button>
                    </li>
                    <li className="card-control opinionbutton">
                        <button
                            className="icon-btn"
                            onClick={() => {
                                const opinionPath = `/into_my_shelf/${book.title.replace(/ /g, "_")}/opinions`;
                                navigate(opinionPath);
                            }}
                            title="Мнения"
                        >
                            <img src="/opinion.svg" alt="" style={{ width: '60px', height: 'auto', verticalAlign: 'middle' }}/>
                            <span className="invisible">Opinion</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default BookCard;
