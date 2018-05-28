const userService = require('./userService');

module.exports = {
    async createUser(ctx, next) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await userService.createUser(ctx.request.body, ctx.state.user);
        RESPONSE_HELPER({ctx, response});
    },

    async authenticate(ctx, next) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await userService.authenticate(ctx.request.body);
        RESPONSE_HELPER({ctx, response});
    },

    async updateUser(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await userService.updateUser(ctx.request.body, ctx.state.user);
        RESPONSE_HELPER({ctx, response});
    },

    async searchUser(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await userService.searchUser(ctx.query);
        RESPONSE_HELPER({ctx, response});
    },

    async getMyPerformanceDistribution(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await userService.getPerformanceDistribution({params: ctx.query, user: ctx.state.user});
        RESPONSE_HELPER({ctx, response});
    },

    async getPerformanceDistribution(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        let user = {_id: ctx.query.userId};
        response.data = await userService.getPerformanceDistribution({params: ctx.query, user});
        RESPONSE_HELPER({ctx, response});
    }
}