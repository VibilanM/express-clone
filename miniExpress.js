function miniExpress() {
    const middlewares = [];
    const routes = [];

    function app(req, res) {

        let index = 0;

        function next() {
            if (index < middleswares.length) {
                const middleware = middlewares[index];
                index++;

                middleware(req, res, next);
            }
            else {
                const route = routes.find((r) => {
                    return r.method === req.method && r.path === req.url;
                });

                if (route) {
                    route.handler(req, res);
                }
                else {
                    res.statusCode = 404;
                    res.end("Not Found");
                }
            }
        }

        next();
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