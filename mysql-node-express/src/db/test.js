const query = require('./db-connection.js');

async function test() {
    try {
        const rows = await query('SELECT 1 + 1 AS solution');
        console.log('Результат запроса:', rows);
    } catch (err) {
        console.error('Ошибка запроса:', err);
    }
}

test();
