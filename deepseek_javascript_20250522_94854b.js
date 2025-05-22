// Пример на Node.js
const http = require('http');
const url = require('url');
const querystring = require('querystring');

let users = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;
    
    if (req.method === 'POST' && path === '/api/user') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Валидация данных
                if (!data.username || !data.password) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username and password are required'}));
                    return;
                }
                
                if (users[data.username]) {
                    // Обновление существующего пользователя
                    // Проверка авторизации
                    if (!req.headers.authorization || req.headers.authorization !== `Bearer ${users[data.username].token}`) {
                        res.writeHead(401, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Unauthorized'}));
                        return;
                    }
                    
                    // Обновляем данные (кроме логина и пароля)
                    for (const key in data) {
                        if (key !== 'username' && key !== 'password') {
                            users[data.username][key] = data[key];
                        }
                    }
                    
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'User updated', profileUrl: `/profile/${data.username}`}));
                } else {
                    // Создание нового пользователя
                    users[data.username] = {
                        password: data.password,
                        ...data,
                        token: generateToken()
                    };
                    
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        username: data.username,
                        password: data.password,
                        profileUrl: `/profile/${data.username}`
                    }));
                }
            } catch (e) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Not found'}));
    }
});

function generateToken() {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});