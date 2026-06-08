function miniExpress() {
    const middlewares = [];
    const errorMiddlewares = [];
    const routes = [];

    async function app(req, res) {

        res.send = function (data) {
            res.end(data);
        };

        res.json = function (data) {
            res.setHeader(
                "Content-Type",
                "application/json"
            );

            res.end(JSON.stringify(data));
        };

        const url = new URL(req.url, "http://localhost");

        req.query = {};

        for (const [key, value] of url.searchParams) {
            req.query[key] = value;
        }

        const body = await new Promise((resolve) => {
            let data = "";

            req.on("data", (chunk) => {
                data += chunk;
            });

            req.on("end", () => {
                resolve(data);
            });
        });

        try {
            req.body = body ? JSON.parse(body) : {};
        }
        catch {
            req.body = {};
        }

        let middlewareIndex = 0;
        let errorIndex = 0;

        function next(err) {

            if (err) {
                return runErrorMiddleware(err);
            }

            if (middlewareIndex < middlewares.length) {
                const middleware = middlewares[middlewareIndex++];

                try {
                    middleware(req, res, next);
                }
                catch (err) {
                    next(err);
                }

                return;
            }

            handleRoute();
        }

        function runErrorMiddleware(err) {
            if (errorIndex < errorMiddlewares.length) {
                const middleware = errorMiddlewares[errorIndex++];

                try {
                    middleware(err, req, res, next);
                }
                catch (newErr) {
                    runErrorMiddleware(newErr);
                }

                return;
            }

            res.statusCode = 500;
            res.json({
                error: err.message
            });
        }

        function handleRoute() {
                const route = routes.find((r) => {
                    return r.method === req.method && r.path === url.pathname;
                });

                if (!route) {
                    res.statusCode = 404;
                    res.end("Not Found");
                    return;
                }

                try {
                    route.handler(req, res);
                }
                catch (err) {
                    next(err);
                }
            }

        next();
    }

    app.use = function (fn) {
        if (fn.length === 4) {
            errorMiddlewares.push(fn);
        }
        else {
            middlewares.push(fn)
        }
    };

    app.get = function (path, handler) {
        routes.push({
            method: "GET",
            path,
            handler
        });
    };

    app.post = function (path, handler) {
        routes.push({
            method: "POST",
            path,
            handler
        });
    };

    return app;
}

module.exports = miniExpress;