const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Сервер запущено на порту 8080...');

wss.on('connection', (ws) => {
    console.log('Новий клієнт підключився');

    ws.on('close', () => {
        console.log('Клієнт відключився');
    });
});

// Функція для генерації випадкового числа (температури)
function getRandomTemperature(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функція розсилки даних
function broadcastTemperature() {
    // Генеруємо температуру від 20 до 100 градусів
    const temperature = getRandomTemperature(20, 100);
    
    const data = JSON.stringify({
        value: temperature,
        timestamp: new Date().toLocaleTimeString()
    });

    // Відправляємо дані всім підключеним клієнтам
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });

    console.log(`Відправлено: ${temperature}°C`);

    // Плануємо наступну відправку через випадковий час (2000-5000 мс)
    const randomDelay = Math.random() * (5000 - 2000) + 2000;
    setTimeout(broadcastTemperature, randomDelay);
}

// Запускаємо цикл відправки
broadcastTemperature();