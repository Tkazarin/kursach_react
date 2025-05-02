import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
export default function BookOpinions() {
    const { book_title } = useParams();
    const [role, setRole] = useState(null);
    const [book, setBook] = useState(null);
    const [opinions, setOpinions] = useState([]);
    const [error, setError] = useState('');

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

                if (data.role === 'SuperUser') {
                    const decodedTitle = book_title.replace(/_/g, ' ');
                    const bookRes = await fetch(`http://localhost:4000/api/v1/shelf/book_looker/${decodedTitle}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                    });
                    const book = await bookRes.json();
                    setBook(book);
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
    }, [book_title]);
    return <div>BookOpinions page (Отзывы о книге) для "{book_title.replace(/_/g, ' ')}"</div>;
}
