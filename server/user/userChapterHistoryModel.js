const userChapterHistorySchema = new MONGOOSE.Schema({
    questionId:  String,
    chapterId: String,
    nOfConcepts: Number,
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
});

module.exports = MONGOOSE.model('UserChapterHistory', userChapterHistorySchema, 'user_chapter_histories');
  