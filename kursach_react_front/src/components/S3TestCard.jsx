import React, { useState } from 'react';

const S3TestCard = () => {
    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPresignedUrls = async () => {
        setLoading(true);
        setFileInfo(null);
        try {
            const response = await fetch('http://localhost:4000/api/v2/bucket_work/get_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageFileName: 'test.JPG',
                    downloadFileName: 'test_2.JPG',
                }),
            });

            const data = await response.json();
            // data — это массив вида [{fileName, url}, ...]
            setFileInfo(data);
        } catch (err) {
            alert('Ошибка получения ссылок');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 340, margin: '50px auto', border: '1px solid #eee', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #eee' }}>
            <h3>S3 Card Test</h3>
            <button onClick={fetchPresignedUrls} disabled={loading}>
                Запросить файлы
            </button>

            {loading && <div>Загружается...</div>}

            {fileInfo && (
                <div style={{ marginTop: 24 }}>
                    {fileInfo.map(({ fileName, url }) => {
                        if (fileName === 'test.JPG') {
                            return url ? (
                                <div key={fileName} style={{ marginBottom: 16 }}>
                                    <div>Изображение:</div>
                                    <img
                                        src={url}
                                        alt={fileName}
                                        style={{ width: '100%', height: 'auto', borderRadius: 8, marginTop: 8, border: '1px solid #ddd' }}
                                    />
                                </div>
                            ) : (
                                <div key={fileName} style={{ color: 'gray' }}>
                                    Нет изображения ({fileName})
                                </div>
                            );
                        }
                        if (fileName === 'test_2.JPG') {
                            return url ? (
                                <div key={fileName}>
                                    <a
                                        href={url}
                                        download={fileName}
                                        style={{
                                            textDecoration: 'none',
                                            background: '#2a59a7',
                                            color: 'white',
                                            padding: '10px 16px',
                                            borderRadius: 5,
                                            fontWeight: 'bold',
                                            fontSize: 15,
                                            display: 'inline-block',
                                        }}
                                    >
                                        Скачать картинку ({fileName})
                                    </a>
                                </div>
                            ) : (
                                <div key={fileName} style={{ color: 'gray' }}>
                                    Нет ссылки для скачивания ({fileName})
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default S3TestCard;
