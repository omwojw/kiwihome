const service = require('../service/comment.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');

/**
 * 내가 받은 후기 리스트
 */
exports.to = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }


  const list = await service.to(token);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};


/**
 * 내가 작성한 후기 리스트
 */
exports.from = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }


  const list = await service.from(token);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};


/**
 * 후기작성하기
 */
exports.create = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

  const record = await service.create(req.body, token);

  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};
/**
 * 신고하기
 */
exports.warning = async (req, res) => {
  const record = await service.warning(req.body);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
};