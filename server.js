const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // Для доступа к index.html

// Функция для генерации случайного количества токенов (от 2000 до 10000)
function generateRandomTokens() {
    return Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
}

// API для получения случайной информации о пользователе
app.get('/api/user', (req, res) => {
    // Генерируем случайные токены
    const randomTokens = generateRandomTokens();
    const user = {
        username: 'RandomUser',
        tokens: randomTokens
    };
    res.json(user);
});

// API для получения таблицы лидеров (генерация случайных значений)
app.get('/api/leaderboard', (req, res) => {
    // Генерация случайных данных для таблицы лидеров
    const leaderboard = [];
    for (let i = 1; i <= 10; i++) {
        leaderboard.push({
            username: `User${i}`,
            tokens: generateRandomTokens()
        });
    }
    res.json(leaderboard);
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


