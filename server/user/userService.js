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
                    [`difficultyDiscribution.${answer.difficulty}`]: 1
                }
            }
            userConceptPromise.push(UserConceptModel.findOneAndUpdate({questionId: answer.questionId, conceptId: concept.id}, update, options))
        })
        return PROMISE.all(userConceptPromise);
    },

    async createUserConceptHistory(userConcept) {
        let options = {
            new: true,
            upsert: true
        };

        let update = {
            "$set": {
                attemptedDiversity: 1,
                correctness: 1,
                score: 1
            }
        }
        return UserConceptHistoryModel.findOneAndUpdate({questionId: userConcept.questionId, conceptId: userConcept.conceptId}, update, options)
    }
}