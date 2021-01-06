const response = require('../../infra/vars')
const commonJwt = require('../../common/common_jwt');


exports.SmartEditor2Skin = async (req, res) => {
  return res.render('admin/se2/SmartEditor2Skin');
};
exports.smart_editor2_inputarea = async (req, res) => {
  return res.render('admin/se2/smart_editor2_inputarea');
};
exports.photo_uploader = async (req, res) => {
  return res.render('admin/se2/photo_uploader');
};