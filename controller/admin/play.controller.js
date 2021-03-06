const key = 'play';
const service = require('../../service/admin/'+key+'.service');
const response = require('../../infra/vars')
const env_data = require('../../infra/env_data')
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
  const booking_list = await service.booking_list(req.params);
  const wait_list = await service.wait_list(req.params);
  const park_list = await service.park_list(req.params);

  if(read.length) {
    Object.assign(tempResData, read[0]);
  }

  resData.read = tempResData;
  resData.booking_list = booking_list;
  resData.wait_list = wait_list;
  resData.park_list = park_list;

  return res.render('admin/'+key+'/read', resData);
};


/**
 * 추가
 */
exports.create = async (req, res) => {
  const resData = {};
  resData.stadium_detail_list = await service.stadium_detail_list(req.body);
  resData.maneger_list = await service.maneger_list(req.body);
  resData.sports_list = await service.sports_list(req.body);
  return res.render('admin/'+key+'/create', resData);
};


/**
 * 추가
 */
exports.creates = async (req, res) => {
  const record = await service.creates(req.body);

  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};

/**
 * 수정
 */
exports.update = async (req, res) => {
  const resData = {};
  const tempResData = {};
  const read = await service.read(req.params);

  if(read.length) {
    Object.assign(tempResData, read[0]);
  }
  resData.stadium_detail_list = await service.stadium_detail_list(req.body);
  resData.maneger_list = await service.maneger_list(req.body);
  resData.sports_list = await service.sports_list(req.body);
  resData.read = tempResData;
  return res.render('admin/'+key+'/update', resData);
};


/**
 * 수정
 */
exports.updates = async (req, res) => {
  const record = await service.updates(req.body);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
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