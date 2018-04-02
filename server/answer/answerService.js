const answerModel = MONGOOSE.model('Answer');
module.exports = {
    async createAnswer({params, user, question}) {
        let answer = new answerModel(params.answer);
        answer.concepts = question.concepts;
        answer.options = question.options;
        answer.chapter =  question.chapter;
        answer.subject =  _.get(question, `chapter.subject`);
        answer.user = user;
        return answer.save();
    }
}