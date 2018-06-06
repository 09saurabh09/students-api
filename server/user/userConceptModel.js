const helperFunction = require('../utils/helperFunction');
const userConceptSchema = new MONGOOSE.Schema({
    conceptId: String,
    weightAttempted: Number,
    weightCorrect: Number,
    difficultyDistribution: {}, // will store number of questions answered by difficulty level for particular concept
    changes: {},
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });

  userConceptSchema.statics.getScore = function(instance) {
    let {attemptedDiversity, correctness} = helperFunction.getUserParams(instance);
    return attemptedDiversity * correctness;
  }
  module.exports = MONGOOSE.model('UserConcept', userConceptSchema, 'user_concepts');
  