const response = require('../infra/vars')
exports.reset = async () => {
    response.success = false;
    response.message = null;
    response.data = null;
 };