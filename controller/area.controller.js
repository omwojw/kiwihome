const service = require('../service/area.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');


/**
 * 리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  const list = await service.list(req.body);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};
