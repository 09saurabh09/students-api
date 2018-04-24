const userConceptSchema = new MONGOOSE.Schema({
    questionId:  String,
    conceptId: String,
    attemptedDiversity: Number,
    correctness: Number,
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
});

module.exports = MONGOOSE.model('UserConceptHistory', userConceptSchema, 'user_concept_histories');
  