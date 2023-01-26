const CONFIG = require('../config/config');
const http = require('http');
const WampRouter = require('fox-wamp')
class WampController {
    constructor() {
        this.httpServer = null;
        this.router = null;
    }

    init(app){
        this.httpServer = http.createServer(app);
        this.router = new WampRouter();
                
        this.httpServer.listen(CONFIG.server.port);
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