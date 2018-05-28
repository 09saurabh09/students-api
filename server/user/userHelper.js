const UserConceptModel = MONGOOSE.model('UserConcept')
const UserConceptHistoryModel = MONGOOSE.model('UserConceptHistory')
const UserChapterModel = MONGOOSE.model('UserChapter')
const UserChapterHistoryModel = MONGOOSE.model('UserChapterHistory');
const UserSubjectModel = MONGOOSE.model('UserSubject')
const UserSubjectHistoryModel = MONGOOSE.model('UserSubjectHistory');

module.exports = {
    getEntityFromType(type) {
        let EntityModel, EntityHistoryModel;
        switch (type) {
            case "concept":
                EntityModel = UserConceptModel;
                EntityHistoryModel = UserConceptHistoryModel
                break;
            case "chapter":
                EntityModel = UserChapterModel;
                EntityHistoryModel = UserChapterHistoryModel;
                break;
            case "subject":
                EntityModel = UserSubjectModel;
                EntityHistoryModel = UserSubjectHistoryModel;
                break;        
        }
        return {EntityModel, EntityHistoryModel};
    }
}