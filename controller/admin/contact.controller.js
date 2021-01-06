const key = 'contact';
const service = require('../../service/admin/'+key+'.service');
const response = require('../../infra/vars')
const commonJwt = require('../../common/common_jwt');



/**
 * 리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  resData.list = await service.list(req.body);
  return res.render('admin/'+key+'/list', resData);
};

/**
 * 상세
 */
exports.read = async (req, res) => {
  const resData = {};
  const tempResData = {};
  const read = await service.read(req.params);

  if(read.length) {
    Object.assign(tempResData, read[0]);
  }
  resData.read = tempResData;
  return res.render('admin/'+key+'/read', resData);
};

/**
 * 삭제
 */
exports.remove = async (req, res) => {
  const record = await service.remove(req.params);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
};

