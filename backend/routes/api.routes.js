const express = require('express');
let router = express.Router();
const ApiController = require('../controllers/api.controller');
const {
    body,
    param
} = require('express-validator');

router.route('/api/')
    .post(ApiController.create)
    .put(ApiController.toggle);

router.route('/api/:id')
    .get([param("id")], ApiController.get)

router.route('/api/:lid/:tid')
    .delete([param("lid"), param("tid")], ApiController.delete);

module.exports = router;