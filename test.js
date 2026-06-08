const http = require("http");

const miniExpress = require("./miniExpress.js");

const app = miniExpress();

app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 3");
    next();
});

app.get("/", (req, res) => {
    res.end("Home Route");
});

app.get("/users", (req, res) => {
    res.end(`User ID: ${req.query.id}`);
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server is running in PORT 3000");
});