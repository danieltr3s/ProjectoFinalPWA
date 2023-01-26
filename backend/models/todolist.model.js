const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const todoListSchema = new Schema({
    id: String,
    listId: String,
    text: String,
    timestamp: Number,
    completed: Boolean,
    err: Boolean,
    user: {
        name: String,
        avatar: String
    }
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.todolist, todoListSchema);