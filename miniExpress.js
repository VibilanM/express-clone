function miniExpress() {
    const middlewares = [];
    const routes = [];

    function app(req, res) {
        const route = routes.find((r) => {
            return r.method === req.method && r.path === req.url;
        });

        if (route) {
            route.handler(req, res);
        }
        else {
            res.statusCode = 404;
            return res.end("404 NOT FOUND.")
        }
    }

    app.use = function (fn) {
        middlewares.push(fn);
    }

    app.get = function (path, handler) {
        routes.push({
            method: "GET",
            path,
            handler
        });
    }

    return app;
};

module.exports = miniExpress;