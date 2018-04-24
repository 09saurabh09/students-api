const answerSchema = new MONGOOSE.Schema({
    questionId:  String,
    optionsSelected: [String],
    status: String,
    difficulty: Number,
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

answerSchema.post('save', function() {
    const self = this;
    const userService = require('../user/userService');
    if (this.wasNew) {
        userService.createUserConcept(self).then(userConcepts => {
            return PROMISE.all(userConcepts.map(userConcept => userService.createUserConceptHistory(userConcept)))
        }).catch(err => {
            LOGGER(`Unable to create user concept history, error: ${err.message} stack: ${err.stack}`);  
        })
    }
});

module.exports = MONGOOSE.model('Answer', answerSchema, 'answers');
  