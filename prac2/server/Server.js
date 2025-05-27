const http = require('http');
const Handler = require('./Handler');

const PORT = 3000;

const server = http.createServer(Handler.handler);

server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});