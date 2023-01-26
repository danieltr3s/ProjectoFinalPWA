module.exports = (app) => {
    app.use('/', require("../routes/api.routes"));
}