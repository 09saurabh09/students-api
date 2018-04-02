const answerSchema = new MONGOOSE.Schema({
    questionId:  String,
    optionsSelected: [String],
    status: String,
    concepts: [],
    options: [],
    chapter: String,
    subject: String,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });
  
  module.exports = MONGOOSE.model('Answer', answerSchema, 'answers');
  