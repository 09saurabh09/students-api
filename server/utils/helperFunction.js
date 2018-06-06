const flat = require('flat');
module.exports = {
    getOldObject(instance) {
        let oldObject = _.cloneDeep(instance);
        const changes = flat(instance.changes, {safe : true});
        _.each(changes, (change, key) => {
            _.set(oldObject, key, _.get(oldObject, key) - change);
        })
        return oldObject;
    },

    getUserParams(userConcept) {
        let tempCoefficient = 0;
        _.each(DIFFICULTY_LEVEL_ENUM, difficulty => {
            tempCoefficient += difficulty * Math.min(GlobalConstant.questionDiversityLimit, _.get(userConcept, `difficultyDistribution.${difficulty}`) || 0);
        })

        let attemptedDiversity = (1 / (GlobalConstant.questionDiversityLimit * GlobalConstant.sumOfDifficulty)) * tempCoefficient;
        let correctness = (userConcept.weightCorrect / userConcept.weightAttempted) || 0;
        return {
            attemptedDiversity,
            correctness
        }
    },

    ensureArray (instance) {
        if (arguments.length === 0) return [];            
        if (arguments.length === 1) {                     
            if (instance === undefined || instance === null) return []; 
            if (Array.isArray(instance)) return instance;               
        }
        return Array.prototype.slice.call(arguments);     
    }
}