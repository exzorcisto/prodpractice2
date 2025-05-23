const http = require('http');
const fs = require('fs'); // файловая система
const path = require('path'); // корректная работа с путями

const PORT = 3000;

const server = http.createServer((req, res) => {
    // обработчик запросов
    console.log('Server request');
    console.log(req.url, req.method);

    // расширение файла
    const extname = path.extname(req.url);
    let contentType = 'text/html';
    let basePath = '';

    // устанавливаем Content-Type в зависимости от расширения файла
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            basePath = path.resolve(__dirname, '..', 'src', 'css', path.basename(req.url));
            break;
        case '.js':
            contentType = 'text/javascript';
            basePath = path.resolve(__dirname, '..', 'src', 'pages', 'TheEncoder', path.basename(req.url));
            break;
        default:
            // обработка HTML-страниц
            switch(req.url) {
                case '/':
                    basePath = path.resolve(__dirname, '..', 'src', 'pages', 'TheEncoder', 'TheEncoder.html');
                    break;
                default:
                    basePath = path.resolve(__dirname, '..', 'src', 'pages', 'Error', 'Error.html');
                    break;
            }
    }

    fs.readFile(basePath, (err, data) => {
        if (err) {
            console.log(err);
            
            // если файл не найден
            if (err.code === 'ENOENT') {
                return sendErrorPage(res, 404);
            }
            
            // для других ошибок - серверная ошибка
            return sendServerError(res);
        }
        
        // если файл успешно прочитан отправляем его
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });

    // вспомогательные функции
    function sendErrorPage(res, statusCode) {
        const errorPagePath = path.resolve(__dirname, '..', 'src', 'pages', 'Error', 'Error.html');
        fs.readFile(errorPagePath, (err, data) => {
            if (err) return sendServerError(res);
            res.writeHead(statusCode, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    function sendServerError(res) {
        res.writeHead(500);
        res.end('Server Error');
    }
});

server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});