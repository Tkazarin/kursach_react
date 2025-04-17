const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');

// Инициализация express
const app = express();

// Инициализация переменных среды
dotenv.config();

// Парсинг запросов с содержимым типа: application/json
app.use(express.json());

// Включение CORS для всех запросов
app.use(cors());

// Включение предварительных запросов (pre-flight)
app.options('/{*any}', cors());

// Определение порта
const port = Number(process.env.PORT || 3331);

// Использование маршрутов пользователей
app.use(`/api/v1/users`, userRouter);

// Обработка ошибки 404
app.all('/{*any}', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Использование middleware для обработки ошибок
app.use(errorMiddleware);

// Запуск сервера
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`)
);

module.exports = app;