const http = require("http");
require("dotenv").config();
const app = require("./app");

const port = 3000 || process.env.PORT;

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at port ${port}...`);
});
