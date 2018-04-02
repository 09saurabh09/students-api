'use strict';

const Router = require('koa-router');
const router = new Router({
	prefix: '/api/answers'
});

const answerController = require('./answerController');

router.post('/', answerController.createAnswer);

module.exports = {router};
