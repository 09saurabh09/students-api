const userConceptSchema = new MONGOOSE.Schema({
    conceptId: String,
    weightAttempted: Number,
    weightCorrect: Number,
    difficultyDiscribution: {}, // will store number of questions answered by difficulty level for particular concept
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });

  module.exports = MONGOOSE.model('UserConcept', userConceptSchema, 'user_concepts');
  