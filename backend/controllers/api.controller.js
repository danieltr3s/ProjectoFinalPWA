const Todos = require('../models/todolist.model');
const { validationResult } = require('express-validator');
const WampServer = require('./wamp.controller');
const wampController = require('./wamp.controller');

exports.get = (req, res) => {
    Todos.find({listId: req.params.id}, (error, todolist) => {
        if (error) throw error;
        let code = 200;
        if (todolist.length <= 0){
            code = 404
        }
        return res.status(code).send(todolist);
    });
}

exports.create = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    new Todos({
        id: req.body.id,
        listId: req.body.listId,
        text: req.body.text,
        timestamp: req.body.timestamp,
        completed: req.body.completed,
        err: req.body.err,
        user: req.body.user
    }).save((error, todo) => {
        if (error) throw error;
        WampServer.create(todo);
        return res.status(202).send(todo);
    });
}

exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Todos.findOneAndUpdate({
        id: req.body.id,
        listId: req.body.listId
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, todo) => {
        if (error) throw error;
        if (!todo) return res.status(404).send("");
        WampServer.update(todo);
        return res.status(202).send(todo);
    });
}

exports.toggle = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Todos.findOne({
        id: req.body.id,
        listId: req.body.listId
    }, (error, todo) => {
        if (error) throw error;
        if (!todo) return res.status(404).send("");

        todo.completed = !todo.completed;
        todo.timestamp = req.body.timestamp;
        todo.user.name = req.body.user.name;
        todo.user.avatar = req.body.user.avatar;

        todo.save((error, todo) => {
            if (error) throw error;
            WampServer.update(todo);
            return res.status(202).send(todo);
        });
    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Todos.deleteOne({
        id: req.params.tid,
        listId: req.params.lid
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(404).send("");
        WampServer.delete({"id": req.params.tid, "listId": req.params.lid});
        return res.status(200).send("");
    });
}
