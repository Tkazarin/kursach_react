import React, {useEffect, useState} from "react";
import '../styles/statics.css';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetch('http://localhost:4000/api/v1/users/whoami', {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                    });
                    if (res.ok) {
                        setAuthorized(true);
                    } else {
                        setAuthorized(false);
                    }
                } else {
                    setAuthorized(false);
                }
            } catch (err) {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    if (loading) return <div className="main-page">Загрузка...</div>;

    return (
        <div className="main-page">
            <div className="main-text">
                <p>Здравствуй, странник!</p>
                <p>Это плато</p>
                <p>или PLATEAUS.</p>
                <p className="pause">Заходи не бойся</p>
            </div>

            <div className="buttons-container">
                {authorized ? (
                    <button className="main-button myshelf" onClick={() => navigate('/my_shelf')}>
                        <img src="/my-profile.svg" alt="" style={{ width: 'auto', height: '23px', verticalAlign: 'middle' }}/>
                    </button>
                ) : (
                    <>
                        <button className="main-button login" onClick={() => navigate('/welcome/user')}>
                            <img src="/login.svg" alt="" style={{ width: 'auto', height: '23px', verticalAlign: 'middle' }}/>
                        </button>
                        <button className="main-button signup" onClick={() => navigate('/nice_to_meet_you/user')}>
                            <img src="/sign-up.svg" alt="" style={{ width: 'auto', height: '23px', verticalAlign: 'middle' }}/>
                        </button>
                    </>
                )}
            </div>
        </div>

    );
}
