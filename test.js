const http = require("http");

const miniExpress = require("./miniExpress.js");

const app = miniExpress();

app.get("/", (req, res) => {
    res.end("Home Route");
});

app.get("/users", (req, res) => {
    res.end("Users Route");
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server is running in PORT 3000");
});