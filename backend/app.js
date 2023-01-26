const CONFIG = require('./config/config');
const WampServer = require('./controllers/wamp.controller');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic("../frontend/dist"));

require('./init/db.js')(app, () => {
    require('./init/middleware')(app);
    require('./init/router')(app);
    app.use('/*', serveStatic("../frontend/dist"));
    app.listen(CONFIG.server.port, CONFIG.server.host, (error) => {
        if (error) throw error;
        console.log('Your app is listening on ' + CONFIG.server.port);
    });
    WampServer.init(app);
});
