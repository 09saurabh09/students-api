const UserModel = MONGOOSE.model('User');
const jwt = require("jsonwebtoken");
const UserConceptModel = MONGOOSE.model('UserConcept')
const UserConceptHistoryModel = MONGOOSE.model('UserConceptHistory')
const questionService = require('../question/questionService');
const helperFunction = require('../utils/helperFunction');

module.exports = {
    async createUser(params) {
        return new UserModel(params.user).save();
    },

    async authenticate(params) {
        const user = await UserModel.findOne({email: params.user.email}).lean().exec();
        if (!await UserModel.comparePassword(params.user.password, user.password)) throw new APP_ERROR({message: `Invalid password`, status: 401});
        user.token = jwt.sign({ id: user._id }, GlobalConstant.tokenSecret, {
            expiresIn: GlobalConstant.tokenValidity // expires depend on env
        });
        delete user.password;
        return user;
    },

    async createUserConcept(answer) {
        let userConceptPromise = [];
        let options = {
            new: true,
            upsert: true
        };
        _.each(answer.concepts, concept => {
            let update = {
                "$inc": {
                    [`difficultyDistribution.${answer.difficulty}`]: 1,
                    "weightAttempted": concept.weight
                }
            }
            if (answer.status == "correct") _.set(update, `$inc.weightCorrect`, concept.weight);
            _.each(_.get(update, `$inc`), (change, key) => {
                _.setWith(update, `changes.${key}`, change, Object);
            });
            userConceptPromise.push(UserConceptModel.findOneAndUpdate({user: answer.user, conceptId: concept.id}, update, options).lean())
        });
        return PROMISE.all(userConceptPromise);
    },

    async createUserConceptHistory(userConcept) {
        let {attemptedDiversity, correctness} = helperFunction.getUserParams(userConcept);
        return new UserConceptHistoryModel({
            user: userConcept.user,
            conceptId: userConcept.conceptId,
            attemptedDiversity,
            correctness,
            score: attemptedDiversity * correctness
        }).save();
    },

    async createUserChapterHistory(userConcepts) {
        let chapterToConceptMapping = {};
        let conceptToUcMapping = {};
        let chapterDiff = {};
        let conceptIds = _.map(userConcepts, uc => uc.conceptId);
        let conceptList = await questionService.getConceptListObject(conceptIds);

        _.each(userConcepts, uch => conceptToUcMapping[uch.conceptId] = uch);
        _.each(conceptList, concept => {
            if (!chapterToConceptMapping[concept.chapter]) chapterToConceptMapping[concept.chapter] = [];
            chapterToConceptMapping[concept.chapter].push(concept._id)
        });
        _.each(chapterToConceptMapping, (concepts, chapter) => {
            let oldScores = [];
            let newScores = [];
            _.each(concepts, conceptId => {
                const oldUcInstance = helperFunction.getOldObject(conceptToUcMapping[conceptId]);
                oldScores.push(UserConceptModel.getScore(oldUcInstance))
                newScores.push(UserConceptModel.getScore(conceptToUcMapping[conceptId]));
            });
            chapterDiff[chapter] = _.sum(newScores) - _.sum(oldScores);
        });
    }
}