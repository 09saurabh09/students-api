const answerService = require('./answerService');
const questionService = require('../question/questionService');

module.exports = {
    async createAnswer(ctx) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        const params = ctx.request.body;
        const question = await questionService.getQuestionObject(_.get(params, `answer.questionId`));
        response.data = await answerService.createAnswer({params, user: ctx.state.user, question});
        RESPONSE_HELPER({ctx, response});
    }
}