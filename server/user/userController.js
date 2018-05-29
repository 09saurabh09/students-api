const userService = require('./userService');
const userHelper = require('./userHelper');

const UserModel = MONGOOSE.model('User');

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
        response.data = await userService.getPerformanceDistribution({params: ctx.query, userIds: [ctx.state.user._id]});
        RESPONSE_HELPER({ctx, response});
    },

    async getPerformanceDistribution(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        let userIds;
        let {query} = ctx;
        if (query.userId) userIds = [query.userId];
        else if (query.standard && query.organization) {
            userIds = await UserModel.find({standard: query.standard, organization: query.organization}).lean().exec().map(user => user._id);
        } else throw new APP_ERROR({message: `One of the parameters not provided`});
        userIds = userIds.map(userId => MONGOOSE.Types.ObjectId(userId));
        response.data = await userService.getPerformanceDistribution({params: query, userIds});
        RESPONSE_HELPER({ctx, response});
    }
}