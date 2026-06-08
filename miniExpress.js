function miniExpress() {
    const middlewares = [];
    const routes = [];

    async function app(req, res) {

        res.send = function (data) {
            res.end(data);
        };

        res.json = function (data) {
            res.setHeader{
                "Content-Type",
                "application/json"
            };

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

        let index = 0;

        function next() {
            if (index < middlewares.length) {
                const middleware = middlewares[index];
                index++;

                middleware(req, res, next);
            }
            else {
                const route = routes.find((r) => {
                    return r.method === req.method && r.path === url.pathname;
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