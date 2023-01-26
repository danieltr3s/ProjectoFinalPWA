const CONFIG = require('../config/config');
const http = require('http');
const WampRouter = require('fox-wamp')

const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('../cert/danielmeiwpwa.ddns.net-key.pem'),
    cert: fs.readFileSync('./cert/danielmeiwpwa.ddns.net-crt.pem')
};

class WampController {
    constructor() {
        this.httpServer = null;
        this.router = null;
    }

    init(app){
        this.httpServer = https.createServer(options, app);
        this.router = new WampRouter();
                
        this.httpServer.listen(CONFIG.server.secureport);
        this.router.listenWAMP({
            server: this.httpServer,
            path: "/ws"
        });
    }

    publish(url, args){
        this.router.getRealm('realm1', function (realm) {
            var api = realm.wampApi()
            api.publish(url, args);
        });
    }

    create(args){
        this.publish(CONFIG.wamp.baseUrl + args.listId + ".todoAdded", args)
    }

    update(args){
        this.publish(CONFIG.wamp.baseUrl + args.listId + ".todoModified", args)
    }
    
    delete(args){
        this.publish(CONFIG.wamp.baseUrl + args.listId + ".todoDeleted", args)
    }
}
module.exports = new WampController();