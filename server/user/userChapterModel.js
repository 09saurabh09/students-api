const userChapterSchema = new MONGOOSE.Schema({
    chapterId: String,
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });

  module.exports = MONGOOSE.model('UserChapter', userChapterSchema, 'user_chapters');
  