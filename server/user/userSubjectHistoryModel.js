const userSubjectHistorySchema = new MONGOOSE.Schema({
    questionId:  String,
    subjectId: String,
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
});

module.exports = MONGOOSE.model('UserSubjectHistory', userSubjectHistorySchema, 'user_subject_histories');
  