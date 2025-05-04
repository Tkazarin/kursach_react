import {useState} from 'react';

function EditOpinionModal({ onClose, onEdited, opinion, size, title }) {
    const [form, setForm] = useState({
        text: opinion.text || null,
        progress: opinion.progress || null
    });

    const [error, setError] = useState("");

    function getChangedFields(form, opinion) {
        const changed = {};
        for (const key in form) {
            if (
                form[key] !== opinion[key] &&
                form[key] !== null &&
                form[key] !== ""
            ) {
                changed[key] = form[key];
            }
        }
        return changed;
    }

    function normalizeForm(form) {
        const normalized = {};
        for (const key in form) {
            if (
                (form[key] === "" || form[key] === undefined)
                && (typeof opinion[key] === "string" || opinion[key] === null)
            ) {
                normalized[key] = null;
            } else {
                normalized[key] = form[key];
            }
        }
        return normalized;
    }


    function validateOpinionForm(form) {
        const errors = {};
        if (form.text)
        {
            if (typeof form.text !== 'string' || form.text.trim().length < 3 || form.text.trim().length > 500)
            {
                errors.push("Мнение должно быть от 3 до 500 символов.");
            }
        }

        if (form.progress) {
            if (!Number.isInteger(Number(form.progress)) || form.progress < 0) {
                errors.push("Прогресс должен быть целым числом.");
            }
            if (size && Number(form.progress) > Number(size)) {
                errors.push("Прогресс не может быть больше количества страниц.");
            }
        }

        if (Object.keys(form).length === 0) {
            errors.common = 'Укажите хотя бы одно поле для обновления';
        }
        const allowUpdates = ['text', 'progress'];
        const invalidFields = Object.keys(form).filter(key => !allowUpdates.includes(key));
        if (invalidFields.length > 0) {
            errors.invalid = 'Допустимы только поля: text, progress';
        }
        return errors;

    }

    function handleChangeOpinion(e) {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }


    async function handleSubmit(e) {
        e.preventDefault();

        const errors = validateOpinionForm(form);
        if (Object.keys(errors).length > 0) {
            alert(
                Object.values(errors).join('\n')
            );
            return;
        }

        const token = localStorage.getItem('token');

        const normalizedForm = normalizeForm(form);
        const changedFields = getChangedFields(normalizedForm, opinion);

        try {
            const response = await fetch(`http://localhost:4000/api/v1/into_shelf/${title}/opinions/${opinion.id_opinion}`, {
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
                    text: opinion.text || null,
                    progress: opinion.progress || null
                }
            )
        } catch (e) {
            alert("Ошибка при добавлении: " + e.message);
        }
    }

    return (
        <div className="edit-user-modal-bg">
            <form className="edit-user-modal" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="edit-user-modal-close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >×</button>
                <h2 className="edit-user-modal-title">Изменить мнение</h2>
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
                <button type="submit" className="edit-user-modal-btn">Добавить</button>
            </form>
        </div>
    );
}

export default EditOpinionModal;