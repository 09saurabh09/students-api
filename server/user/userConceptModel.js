const userConceptSchema = new MONGOOSE.Schema({
    questionId:  String,
    conceptId: String,
    difficultyDiscribution: {}, // will store number of questions answered by difficulty level for particular concept
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });

  module.exports = MONGOOSE.model('UserConcept', userConceptSchema, 'user_concepts');
  