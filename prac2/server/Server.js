const http = require('http');
const fs = require('fs'); // file system
const path = require('path'); // forming the correct path

const PORT = 3000

const server = http.createServer((req, res) => {
    console.log('Server request');
    console.log(req.url, req.method);

    res.setHeader('Content-type', 'text/html')

    const createPath = (page) => path.resolve('src', 'pages', `${page}`, `${page}.html`);

    let basePath = '';
    switch(req.url) {
        case '/':
            basePath = createPath('TheEncoder');
            res.statusCode = 200;
            break;
        default:
            basePath = createPath('Error');
            res.statusCode = 404;
            break;
    }

    fs.readFile(basePath, (err, data) => {
        if (err) {
            console.log(err)
            res.end();
        }
        else {
            res.write(data);
            res.end();
        }
    })
    
});

server.listen(3000, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

