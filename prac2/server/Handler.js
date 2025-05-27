const fs = require('fs');
const path = require('path');
const { TEXT_CONSTANTS } = require('./text'); // Импортируем константы

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

function replacePlaceholders(html) {
    return html
        .replace('id="pageTitle">#</title>', `id="pageTitle">${TEXT_CONSTANTS.PAGE_TITLE}</title>`)
        .replace('id="mainHeading"></h1>', `id="mainHeading">${TEXT_CONSTANTS.MAIN_HEADING}</h1>`)
        .replace('id="inputLabel"></h2>', `id="inputLabel">${TEXT_CONSTANTS.INPUT_LABEL}</h2>`)
        .replace('id="outputLabel"></h2>', `id="outputLabel">${TEXT_CONSTANTS.OUTPUT_LABEL}</h2>`)
        .replace('placeholder="Введите текст здесь..."', `placeholder="${TEXT_CONSTANTS.INPUT_PLACEHOLDER}"`)
        .replace('placeholder="Введите текст здесь..." readonly', `placeholder="${TEXT_CONSTANTS.OUTPUT_PLACEHOLDER}" readonly`)
        .replace('id="encryptBtn">#</button>', `id="encryptBtn">${TEXT_CONSTANTS.BUTTON_TEXT}</button>`);
}

function handler(req, res) {
    console.log('Server request');
    console.log(req.url, req.method);

    const extname = path.extname(req.url);
    let contentType = 'text/html';
    let basePath = '';

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
            switch(req.url) {
                case '/':
                    basePath = path.resolve(__dirname, '..', 'src', 'pages', 'TheEncoder', 'TheEncoder.html');
                    break;
                default:
                    basePath = path.resolve(__dirname, '..', 'src', 'pages', 'Error', 'Error.html');
                    break;
            }
    }

    fs.readFile(basePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            
            if (err.code === 'ENOENT') {
                return sendErrorPage(res, 404);
            }
            
            return sendServerError(res);
        }
        
        if (contentType === 'text/html') {
            data = replacePlaceholders(data);
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

module.exports = {
    handler,
    sendErrorPage,
    sendServerError
};