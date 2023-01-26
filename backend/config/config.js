module.exports = {
    mongodb: {
        uri: 'mongodb://127.0.0.1/tocolabdo',
        collections: {
            todolist: 'todos'
        }
    },
    wamp: {
        baseUrl: "com.tocolabdo."
    },
    server: {
        port: 8081,
        host: "127.0.0.1"
    }
}