'use strict';

const Router = require('koa-router');
const router = new Router({
	prefix: '/api/users'
});

const publicRouter = new Router({
	prefix: '/public/api/users'
});

const internalRouter = new Router({
	prefix: '/internal/api/users'
});

const userController = require('./userController');

publicRouter.post('/', userController.createUser);

publicRouter.post('/authenticate', userController.authenticate);

router.post('/put', userController.updateUser);

internalRouter.get('/search', userController.searchUser);

// API to used by user for performance in concept, chapteror subject based on params
router.get('/my-performance', userController.getMyPerformanceDistribution)

// API to be used by teachers to monitor performance
internalRouter.get('/performance', userController.getPerformanceDistribution);

module.exports = {router, publicRouter, internalRouter};
