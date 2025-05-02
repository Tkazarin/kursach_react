import React, { useState } from 'react';

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

export default function S3TestUploadCard() {
    const [uploadFiles, setUploadFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        const filesArr = Array.from(e.target.files);
        setUploadFiles(filesArr.map(f => ({ name: f.name, file: f })));
        setSuccess(false);
        setError('');
    };

    const handleUpload = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await S3UploadCard(uploadFiles);
            setSuccess(true);
        } catch (err) {
            setError('Ошибка загрузки: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: 20, maxWidth: 400 }}>
            <h3>Загрузка файлов в S3</h3>
            <input
                multiple
                type="file"
                onChange={handleFileChange}
            />
            <br />
            <button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0 || loading}
                style={{ marginTop: 10 }}
            >
                {loading ? 'Загрузка...' : 'Загрузить файлы в S3'}
            </button>
            {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 10 }}>Файлы успешно загружены!</div>}
        </div>
    );
}
