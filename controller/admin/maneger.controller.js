const key = 'maneger';
const service = require('../../service/admin/'+key+'.service');
const stadiumService = require('../../service/admin/stadium.service');
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

  if(read.length) {
    Object.assign(tempResData, read[0]);
  }
  resData.maneger_bookmark_list = await service.maneger_bookmark_list(req.params);
  resData.play_list = await service.play_list(req.params);
  resData.maneger_item_list = await service.maneger_item_list(req.params);
  resData.read = tempResData;

  return res.render('admin/'+key+'/read', resData);
};

/**
 * 추가
 */
exports.create = async (req, res) => {
  const resData = {};
  resData.sports_list = await stadiumService.sports_list(req.body);
  resData.item_list = await service.item_list(req.body);
  resData.bank_list = await service.bank_list(req.body);
  return res.render('admin/'+key+'/create', resData);
};


/**
 * 추가
 */
exports.creates = async (req, res) => {
  const resData = {};
  const record = await service.creates(req.body);
  if(record[1]){
    const addRowObj = await service.last_read(req.body);
    if(addRowObj.length) {
      Object.assign(resData, addRowObj[0]);
    }
    if(req.body.use_list && req.body.use_list.length){
      await service.creates_use(req.body, resData);
    }
    
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
  resData.read = tempResData;
  resData.sports_list = await stadiumService.sports_list(req.body);
  resData.item_list = await service.item_list(req.body);
  resData.maneger_item_list = await service.maneger_item_list(req.params);
  resData.bank_list = await service.bank_list(req.body);
  return res.render('admin/'+key+'/update', resData);
};


/**
 * 수정
 */
exports.updates = async (req, res) => {
  const record = await service.updates(req.body);

  if(record[0].changedRows){
    if(req.body.use_list && req.body.use_list.length){
      await service.deletes_use(req.body);

      var temp = {"maneger_seq":req.body.seq}
      await service.creates_use(req.body, temp);
    }
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