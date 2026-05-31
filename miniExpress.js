function miniExpress() {
    const middlewares = [];
    const routes = [];

    return {
        use(fn) {
            middlewares.push(fn);
        },
        get(route, handler) {
            routes.push({
                method: "GET",
                route,
                handler
            });
        }
    };
};

module.exports = miniExpress;