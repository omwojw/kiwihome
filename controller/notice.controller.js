const key = 'notice';
const service = require('../service/'+key+'.service');
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

/**
 * 상세
 */
exports.read = async (req, res) => {
  const resData = {};
  const read = await service.read(req.params);

  if(read.length) {
    Object.assign(resData, read[0]);
  }
  response.success = true;
  response.data = resData;
  return res.status(200).send(response);
};



