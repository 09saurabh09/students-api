const UserModel = MONGOOSE.model('User');
const jwt = require("jsonwebtoken");
const UserConceptModel = MONGOOSE.model('UserConcept')
const UserConceptHistoryModel = MONGOOSE.model('UserConceptHistory')
const UserChapterModel = MONGOOSE.model('UserChapter')
const UserChapterHistoryModel = MONGOOSE.model('UserChapterHistory');
const UserSubjectModel = MONGOOSE.model('UserSubject')
const UserSubjectHistoryModel = MONGOOSE.model('UserSubjectHistory');
const questionService = require('../question/questionService');
const helperFunction = require('../utils/helperFunction');
const userHelper = require('./userHelper');

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

    async createUserChapter(userConcepts) {
        let chapterToConceptMapping = {};
        let conceptToUcMapping = {};
        let chapterDiff = {};
        let userChapterPromise = [];
        let conceptIds = _.map(userConcepts, uc => uc.conceptId);

        // We are not picking chapter from answer instance because one concept can belong to multiple chapters
        // So answering this question will impact performance in all chapters
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

            // This diff consist of change in proficiency level of these particular concepts
            chapterDiff[chapter] = _.sum(newScores) - _.sum(oldScores);
        });

        let chapterWiseConceptCount = await questionService.getChapterWiseConceptCount(Object.keys(chapterDiff));

        let options = {
            new: true,
            upsert: true
        };
        _.each(chapterDiff, (currentChapterDiff, chapterId) => {
            let update = {
                "$inc": {
                    "score": currentChapterDiff / chapterWiseConceptCount[chapterId]
                }
            }
            _.each(_.get(update, `$inc`), (change, key) => {
                _.setWith(update, `changes.${key}`, change, Object);
            });
            userChapterPromise.push(UserChapterModel.findOneAndUpdate({user: userConcepts[0].user, chapterId: chapterId}, update, options).lean())
        });

        return PROMISE.all(userChapterPromise);
    },

    async createUserChapterHistory(userChapter) {
        return new UserChapterHistoryModel({
            user: userChapter.user,
            chapterId: userChapter.chapterId,
            score: userChapter.score
        }).save();
    },

    async updateUser(params, user) {
        let update = {
            $set: _.pick(params.user, ['name', 'email', 'organization', 'standard', 'subjects'])
        }
        return UserModel.findOneAndUpdate({_id: user._id}, update, {new: true});
    },

    async searchUser(params) {
        let searchQuery = {};
        if (params.name) searchQuery.name =  new RegExp(params.email, 'i');
        if (params.email) searchQuery.email = params.email;
        return UserModel.find(searchQuery).select({name: 1}).lean().exec();
    },

    async createUserSubject({answer, userChapters}) {
        let subjectId = answer.subject;
        let diff = 0;
        _.each(userChapters, userChapter => {
            const oldUserChapterInstance = helperFunction.getOldObject(userChapter);
            diff += userChapter.score - (oldUserChapterInstance.score || 0);
        })
        
        // TODO avoid history creation in case of 0 diff
        const chapterCount = await questionService.getChapterCount(subjectId);
        let update = {
            "$inc": {
                "score": diff / chapterCount[subjectId] // TODO put check for non zero denominator
            }
        }
        let options = {
            new: true,
            upsert: true
        };
        _.each(_.get(update, `$inc`), (change, key) => {
            _.setWith(update, `changes.${key}`, change, Object);
        });
        return UserSubjectModel.findOneAndUpdate({user: answer.user, subjectId}, update, options)
    },

    async createUserSubjectHistory(UserSubject) {
        return new UserSubjectHistoryModel({
            user: UserSubject.user,
            subjectId: UserSubject.subjectId,
            score: UserSubject.score
        }).save();
    },

    async getPerformanceDistribution({params, userIds}) {
        const {EntityHistoryModel} = userHelper.getEntityFromType(params.type);

        if (!EntityHistoryModel || !params.id) throw new APP_ERROR({message: `Type or id is not valid`});
        const pipeline = [
            {
                $match: {user: {"$in": userIds}, [`${params.type}Id`]: params.id}
            },
            {
              $group : {
                 _id : { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
                 score: { $sum: "$score" }
              }
            }
         ]
        return EntityHistoryModel.aggregate(pipeline).exec();
    }
}