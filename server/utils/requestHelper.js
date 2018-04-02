"use strict";
const request = require('requestretry');
// const helperFunction = require('./helperFunction')

module.exports = async function (options) {
    let consoleOptions = !_.isEmpty(options.skipFields) ? _.cloneDeep(options) : options;
    
    // Remove restriced keys
    // helperFunction.modifyObject(options, consoleOptions, 'req');
    LOGGER(`Calling API with options ${JSON.stringify(options)} `);
    const response = await request(options);
    let consoleResponse = !_.isEmpty(options.skipFields) ? _.cloneDeep(response) : response;

    // Remove restriced keys
    // helperFunction.modifyObject(options, consoleResponse, 'res');
    LOGGER(`API response for ${JSON.stringify(consoleOptions)} is ${JSON.stringify(consoleResponse)}`);
    return response;
};
