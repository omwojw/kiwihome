const service = require('../../service/admin/login.service');
const response = require('../../infra/vars')
const commonJwt = require('../../common/common_jwt');


/**
 * 관리자 로그아웃
 */
exports.logout = async (req, res) => {
  req.session.destroy(function(err) {
    
  })
  return res.redirect('/supervise');
};


/**
 * 관리자 로그인
 */
exports.api_login = async (req, res) => {
  const resData = {};
  const read = await service.api_login(req.body);
  
  
  if(read.length) {
    Object.assign(resData, read[0]);
    console.log(resData)

    req.session.ADMIN = resData;
    response.success = true;
  }


  return res.status(200).send(response);
};
