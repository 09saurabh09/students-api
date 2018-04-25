const answerModel = MONGOOSE.model('Answer');
module.exports = {
    async createAnswer({params, user, question}) {
        let answer = new answerModel(params.answer);
        answer.concepts = question.concepts;
        answer.options = question.options;
        answer.chapter =  question.chapter;
        answer.difficulty = question.difficulty;
        answer.subject =  _.get(question, `chapter.subject`);
        answer.user = user;
        const correctOptions = question.options.filter(option => option.isCorrect).map(option => option._id);
        if (_.isEqual(correctOptions.sort(), answer.optionsSelected.sort())) answer.status = "correct";
        else answer.status = "incorrect";
        return answer.save();
    }
}