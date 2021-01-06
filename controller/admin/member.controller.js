const key = 'member';
const service = require('../../service/admin/'+key+'.service');
const warningService = require('../../service/admin/warning.service');
const cardService = require('../../service/admin/card.service');
const response = require('../../infra/vars')
const env_data = require('../../infra/env_data')
const commonJwt = require('../../common/common_jwt');
const request = require('request-promise-native');


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
  resData.booking_list = await service.booking_list(req.params);
  resData.stadium_list = await service.stadium_list(req.params);
  resData.card_list = await this.card_list(req, res);
  resData.warning_list = await warningService.warning_list(req.params);
  resData.read = tempResData;

  return res.render('admin/'+key+'/read', resData);
};

/**
 * 추가
 */
exports.create = async (req, res) => {
  return res.render('admin/'+key+'/create');
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

/**
 * 카드리스트
 */
exports.card_list = async (req, res) => {

 /**
   * 어세스 토큰 가져오기
   */
  const getToken = await request({
    url: 'https://api.iamport.kr/users/getToken',
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    form: {
        imp_key: env_data.impkey,
        imp_secret: env_data.impsecret,
    },
    json: true,
  })

  const card_list = await cardService.card(req.params);
  if(card_list && card_list.length){
    var customer_uid = "";
    for(var i = 0 ; i < card_list.length ; i++){
      customer_uid += "customer_uid[]="+card_list[i].card_key+"&"
    }
    customer_uid = customer_uid.substring(0, (customer_uid.length-1))

    /**
     * 아임포트 카드리스트 가져오기
     */
    const cardResult = await request({
      method: 'GET',
      url: 'https://api.iamport.kr/subscribe/customers?'+customer_uid,
      headers: { "Authorization": getToken.response.access_token },
      json: true,
    })



    for(var x = 0 ; x < card_list.length ; x++){
        for(var i = 0 ; i < cardResult.response.length ; i++){
          if(cardResult.response[i].customer_uid == card_list[x].card_key){
            cardResult.response[i].is_payment = card_list[x].is_payment;
            cardResult.response[i].card_seq = card_list[x].card_seq;
          }
      }
    }

    response.success = true;
    response.data = cardResult.response;
  }else{
    response.data = [];
  }
 
  console.log(response.data);
  return response.data;
};