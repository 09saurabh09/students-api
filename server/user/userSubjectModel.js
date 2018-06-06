const userSubjectSchema = new MONGOOSE.Schema({
    subjectId: String,
    score: Number,
    user: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User' },
  }, {
      timestamps: true
  });

  module.exports = MONGOOSE.model('UserSubject', userSubjectSchema, 'user_subjects');
  