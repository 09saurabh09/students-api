const UserModel = MONGOOSE.model('User');
const jwt = require("jsonwebtoken");
const UserConceptModel = MONGOOSE.model('UserConcept')
const UserConceptHistoryModel = MONGOOSE.model('UserConceptHistory')

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
                    [`difficultyDiscribution.${answer.difficulty}`]: 1,
                    "weightAttempted": concept.weight
                }
            }
            if (answer.status == "correct") _.set(update, `$inc.weightCorrect`, concept.weight);
            userConceptPromise.push(UserConceptModel.findOneAndUpdate({user: answer.user, conceptId: concept.id}, update, options))
        })
        return PROMISE.all(userConceptPromise);
    },

    async createUserConceptHistory(userConcept) {
        let tempCoefficient = 0;
        _.each(DIFFICULTY_LEVEL_ENUM, difficulty => {
            tempCoefficient += difficulty * Math.min(GlobalConstant.questionDiversityLimit, _.get(userConcept, `difficultyDiscribution.${difficulty}`) || 0);
        })

        let attemptedDiversity = (1 / (GlobalConstant.questionDiversityLimit * GlobalConstant.sumOfDifficulty)) * tempCoefficient;
        let correctness = userConcept.weightCorrect / userConcept.weightAttempted;
        return new UserConceptHistoryModel({
            user: userConcept.user,
            conceptId: userConcept.conceptId,
            attemptedDiversity,
            correctness,
            score: attemptedDiversity * correctness
        }).save();
    }
}