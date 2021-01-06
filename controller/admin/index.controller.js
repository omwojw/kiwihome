const service = require('../../service/admin/login.service');
const response = require('../../infra/vars')
const commonJwt = require('../../common/common_jwt');


/**
 * 관리자 메인페이지
 */
exports.index = async (req, res) => {
  if(req.session.ADMIN && req.session.ADMIN.admin_seq){
    return res.render('admin/index');
  }else{
    return res.render('admin/login');
  }
};
