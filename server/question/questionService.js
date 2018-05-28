const requestHelper = require('../utils/requestHelper');

module.exports = {
    async getQuestionById(id) {
        let url = `${QUSETION_SERVER}/internal/api/questions/${id}`;
        let options = {
            url,
            method: 'GET',
            json: true
        };
        return requestHelper(options);
    },

    async getQuestionObject(id) {
		const self = this;
		const {body, statusCode} = await self.getQuestionById(id);
		if(statusCode !== 200) throw new Error(`Unbale to fetch question details`);
		return _.get(body, `data`);
    },
    
    async getConceptList(conceptIdList) {
        let url = `${QUSETION_SERVER}/internal/api/concepts/list-concepts`;
        let options = {
            url,
            method: 'GET',
            json: true,
            qs: {
                conceptId: conceptIdList
            },
            useQuerystring: true
        };
        return requestHelper(options);
    },

    async getConceptListObject(conceptIdList) {
		const self = this;
		const {body, statusCode} = await self.getConceptList(conceptIdList);
		if(statusCode !== 200) throw new Error(`Unbale to fetch concept list`);
		return _.get(body, `data`);
    },

    async getChapterWiseConceptCount(chapterIdList) {
        let url = `${QUSETION_SERVER}/internal/api/concepts/chapter-wise-count`;
        let options = {
            url,
            method: 'GET',
            json: true,
            qs: {
                chapterId: chapterIdList
            },
            useQuerystring: true
        };
		const {body, statusCode} = await requestHelper(options);
		if(statusCode !== 200) throw new Error(`Unbale to fetch concept list`);
		return _.get(body, `data`);
    },

    async getChapterCount(subject) {
        let url = `${QUSETION_SERVER}/internal/api/chapters/chapter-count`;
        let options = {
            url,
            method: 'GET',
            json: true,
            qs: {
                subject
            },
            useQuerystring: true
        };
		const {body, statusCode} = await requestHelper(options);
		if(statusCode !== 200) throw new Error(`Unbale to fetch concept list`);
		return _.get(body, `data`);
    }
}