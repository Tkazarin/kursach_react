import { useParams } from 'react-router-dom';
export default function BookOpinions() {
    const { book_title } = useParams();
    return <div>BookOpinions page (Отзывы о книге) для "{book_title}"</div>;
}
