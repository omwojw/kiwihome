const key = 'contact';
const service = require('../service/'+key+'.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');



/**
 * 리스트
 */
exports.create = async (req, res) => {
  const resData = {};
  record = await service.create(req.body);
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};
