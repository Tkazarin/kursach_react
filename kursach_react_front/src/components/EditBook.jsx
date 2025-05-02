import {useState} from 'react';
import '../styles/EditBook.css';

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

function EditBookModal({ book, onClose, onEdited, userInfo }) {
    const [form, setForm] = useState({
        title: book.title || "",
        author: book.author || "",
        description: book.description || null,
        size: book.size || null,
        progress: book.progress || null,
        file: null,
        file_img: null
    });

    const [error, setError] = useState("");

    function getChangedFields(form, book) {
        const changed = {};
        for (const key in form) {
            if (key === 'file' || key === 'file_img') continue;
            if (form[key] !== book[key]) {
                changed[key] = form[key];
            }
        }
        return changed;
    }

    function normalizeForm(form) {
        const normalized = {};
        for (const key in form) {
            // Оставь файлы как есть, иначе их не загрузишь!
            if (key === "file" || key === "file_img") {
                normalized[key] = form[key];
            } else if (
                (form[key] === "" || form[key] === undefined)
                && (typeof book[key] === "string" || book[key] === null)
            ) {
                normalized[key] = null;
            } else {
                normalized[key] = form[key];
            }
        }
        return normalized;
    }


    function validateForm(form) {
        const errors = [];

        if (form.title && (typeof form.title !== 'string' || form.title.trim().length < 3 || form.title.trim().length > 40)) {
            errors.push("Название должно быть от 3 до 40 символов.");
        }
        if (!form.author && (typeof form.author !== 'string' || form.author.trim().length < 3 || form.author.trim().length > 40)) {
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
    function handleChangeBook(e) {
        const { name, value, files } = e.target;
        if (files && files.length) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }

    function isValidCover(file) {
        console.log(file);
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

        const normalizedForm = normalizeForm(form);
        const changedFields = getChangedFields(normalizedForm, book);


        if (coverFile) changedFields.file_img = nickname + coverFile.name;
        if (downloadFile) changedFields.file = nickname + downloadFile.name;

        if (Object.keys(changedFields).length === 0) {
            alert("Вы ничего не изменили!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/v1/shelf/${book.id_book}`, {
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
                    title: book.title || "",
                    author: book.author || "",
                    description: book.description || "",
                    size: book.size || null,
                    progress: book.progress || null,
                    file: null,
                    file_img: null
                }
            )
        } catch (e) {
            alert("Ошибка при добавлении: " + e.message);
        }
    }

    return (
        <div className="edit-book-modal-bg">
            <form className="edit-book-modal" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="edit-book-modal-close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >×</button>
                <h2 className="edit-book-modal-title">Редактировать книгу</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Название"
                    value={form.title}
                    onChange={handleChangeBook}
                    className="edit-book-modal-field"
                    maxLength={40}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Автор"
                    value={form.author}
                    onChange={handleChangeBook}
                    className="edit-book-modal-field"
                    maxLength={40}
                />
                <input
                    type="number"
                    name="size"
                    placeholder="Кол-во страниц"
                    value={form.size}
                    onChange={handleChangeBook}
                    className="edit-book-modal-field"
                />
                <input
                    type="number"
                    name="progress"
                    placeholder="Прогресс (стр.)"
                    value={form.progress}
                    onChange={handleChangeBook}
                    className="edit-book-modal-field"
                />
                <textarea
                    name="description"
                    placeholder="Описание (по желанию)"
                    value={form.description}
                    onChange={handleChangeBook}
                    className="edit-book-modal-field"
                    maxLength={300}
                ></textarea>
                <div style={{ marginBottom: 12 }}>
                    <label className="edit-book-modal-file-label">Обложка:</label>
                    <input
                        type="file"
                        accept="image/*"
                        name="file_img"
                        onChange={handleChangeBook}
                        style={{ marginBottom: 8, color: 'var(--edit-book-modal-label-color)' }}
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label className="edit-book-modal-file-label">Файл (опционально):</label>
                    <input
                        type="file"
                        name="file"
                        onChange={handleChangeBook}
                        style={{ color: 'var(--edit-book-modal-label-color)' }}
                    />
                </div>
                <button type="submit" className="edit-book-modal-btn">Добавить</button>
            </form>
        </div>
    );
}

export default EditBookModal;