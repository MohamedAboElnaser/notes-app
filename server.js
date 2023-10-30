const http = require("http");
require("dotenv").config();
const app = require("./src/app");

const port = 3000 || process.env.PORT;

const server = http.createServer(app);
server.listen(port, () => {
    console.log(
        `Server running at ${process.env.NODE_ENV} environment at port ${port}...`
    );
});

module.exports = server;
