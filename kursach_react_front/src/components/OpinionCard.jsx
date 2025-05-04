import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OpinionCard.css';
import { format } from 'date-fns';


function OpinionCard({ opinion, onHidden, onEdit, title, size}) {
    const id_opinion = opinion.id_opinion;
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setIsDeleting(true);
        console.log(`http://localhost:4000/api/v1/into_shelf/${title}/${opinion.id_opinion}`);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/v1/into_shelf/${title}/opinions/${opinion.id_opinion}`, {
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
    const formattedDate = format(new Date(opinion.date), 'dd.MM.yyyy');
    return (
        <div className={`opinion-card${isDeleting ? ' deleteme' : ''}`}>
            <div className="opinioninfo">
                <div className="opinion-text-container">
                    <div className="opinion-card-date">{formattedDate}</div>
                    {size && opinion.progress && (
                        <div className="opinion-card-progress">Прогресс: {opinion.progress} из {size}</div>
                    )}
                </div>
                <div className="opinion-text">
                    <div className="opinion-card-text">{opinion.text}</div>
                </div>
                <ul className="opinion-card-controls">
                    <li className="opinion-card-control">
                        <button
                            className="icon-btn"
                            onClick={() => onEdit(opinion)}
                            title="Редактировать"
                        >
                            <img src="/edit-1.svg" alt="" style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }}/>
                            <span className="invisible">Edit</span>
                        </button>
                    </li>
                    <li className="opinion-card-control deletebutton">
                        <button
                            className="icon-btn"
                            onClick={handleDelete}
                            title="Удалить"
                        >
                            <img src="/delete-1.svg" alt="" style={{ width: 'auto', height: '20px', verticalAlign: 'middle' }}/>
                            <span className="invisible">Delete</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default OpinionCard;
