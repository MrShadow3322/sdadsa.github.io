const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // Для доступа к index.html

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Модель пользователя
const userSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true, required: true },
    username: String,
    registrationDate: Date,
    tokens: { type: Number, default: 0 },
    referralCode: String,
    referredBy: String
});

const User = mongoose.model('User', userSchema);

function calculateTokens(registrationDate) {
    const years = (Date.now() - new Date(registrationDate)) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(years * 1000); // 1000 токенов за каждый год
}

function generateReferralCode(telegramId) {
    return Buffer.from(telegramId).toString('base64');
}

// API для регистрации пользователя
app.post('/api/register', async (req, res) => {
    const { telegramId, username, registrationDate } = req.body;

    const userExists = await User.findOne({ telegramId });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const tokens = calculateTokens(registrationDate);
    const referralCode = generateReferralCode(telegramId);

    const newUser = new User({
        telegramId,
        username,
        registrationDate,
        tokens,
        referralCode
    });

    await newUser.save();
    res.json({ message: 'User registered', tokens });
});

// API для получения таблицы лидеров
app.get('/api/leaderboard', async (req, res) => {
    const users = await User.find().sort({ tokens: -1 }).limit(10);
    res.json(users);
});

// API для получения информации о пользователе
app.get('/api/user', async (req, res) => {
    // В реальном приложении здесь нужно получать данные о текущем пользователе
    const user = await User.findOne(); // Возьмем первого попавшегося пользователя для примера
    res.json(user);
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

