"use strict";
const env = process.env;
global.NODE_ENV = process.env.NODE_ENV;
const redis = require('redis');
const bluebird = require('bluebird');
const moment = require('moment');
const AppError = require('../utils/appError');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');
let config;


global.APP_CONFIG = config;
global.MONGO_URL = process.env.MONGO_URL;
global.REDIS_URL = process.env.REDIS_URL;

const client = redis.createClient(REDIS_URL);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

global._ = require('lodash');
global.MONGOOSE = require('mongoose');
global.PROMISE = bluebird;
global.REDIS_CLIENT = client;
global.APP_ERROR = AppError;
global.RESPONSE_HELPER = responseHelper;
global.RESPONSE_MESSAGE = responseMessage;
global.LOGGER = (text) => {
	console.log(text + " timestamp - " + moment().format());
};
global.DIFFICULTY_LEVEL_ENUM = [1, 2, 3, 4];
global.ANSWER_STATUS_ENUM = ["correct", "partialCorrect", "incorrect"];
MONGOOSE.Promise = PROMISE;

// API servers
global.QUSETION_SERVER = env.QUSETION_SERVER

global.GlobalConstant = {};
GlobalConstant.tokenSecret = env.TOKEN_SECRET;
GlobalConstant.tokenValidity = env.TOKEN_VALIDITY;
GlobalConstant.questionDiversityLimit = 10;
GlobalConstant.sumOfDifficulty= DIFFICULTY_LEVEL_ENUM.reduce((a, b) => a + b, 0);