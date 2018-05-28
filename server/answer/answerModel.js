const answerSchema = new MONGOOSE.Schema({
    questionId:  String,
    optionsSelected: [String],
    status: {
        type: String,
        enum: ANSWER_STATUS_ENUM
    },
    difficulty: {
        type: String,
        enum: DIFFICULTY_LEVEL_ENUM
    },
    concepts: [],
    options: [],
    chapter: String,
    subject: String,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });
  
answerSchema.pre('save', function(next) {
    this.wasNew = this.isNew;
    next();
});

answerSchema.post('save', async function() {
    const self = this;
    const userService = require('../user/userService');
    if (this.wasNew) {
        try {
            let userConcepts = await userService.createUserConcept(self);
            await PROMISE.all(userConcepts.map(userConcept => userService.createUserConceptHistory(userConcept)));
            let userChapters = await userService.createUserChapter(userConcepts);
            await PROMISE.all(userChapters.map(userChapter => userService.createUserChapterHistory(userChapter)));
            let userSubject = await userService.createUserSubject({answer: self, userChapters});
            await userService.createUserSubjectHistory(userSubject);
        } catch(err) {
            LOGGER(`Unable to create user concept history, error: ${err.message} stack: ${err.stack}`);  
        }

        // userService.createUserConcept(self).then(userConcepts => {
        //     return PROMISE.all(userConcepts.map(userConcept => userService.createUserConceptHistory(userConcept))).then(userService.createUserChapterHistory);
        // }).catch(err => {
        //     LOGGER(`Unable to create user concept history, error: ${err.message} stack: ${err.stack}`);  
        // })
    }
});

module.exports = MONGOOSE.model('Answer', answerSchema, 'answers');
  