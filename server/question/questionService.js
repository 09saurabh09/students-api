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
	}
}