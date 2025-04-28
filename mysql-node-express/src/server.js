const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const bookRouter = require('./routes/book.route');
const opinionRouter = require('./routes/opinion.route');
const s3Router = require('./routes/s3.route')

// Инициализация express
const app = express();

// Инициализация переменных среды
dotenv.config();

// Парсинг запросов с содержимым типа: application/json
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


// Определение порта
const port = Number(process.env.PORT || 3331);

// Использование маршрутов пользователей
app.use(`/api/v1/users`, userRouter);
app.use('/api/v1/shelf', bookRouter);
app.use('/api/v1/into_shelf', opinionRouter);
app.use('/api/v2/bucket_work', s3Router);


// Обработка ошибки 404
app.all('/{*any}', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

app.use(errorMiddleware);

// Запуск сервера
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`)
);

module.exports = app;