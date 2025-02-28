const http = require('http');
const logger = require('./utils/logger');
const routes = require('./routes/routes');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    routes.handleRequest(req, res);
});

server.listen(PORT, () => {
    logger.logMessage(`Server is running on port ${PORT}`);
});
