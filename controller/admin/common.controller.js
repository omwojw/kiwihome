const key = 'common';
const service = require('../../service/admin/'+key+'.service');
const response = require('../../infra/vars')
const commonJwt = require('../../common/common_jwt');

var multiparty = require('multiparty');

/**
 * 공통 파일업로드
 */
exports.file_update = async (req, res) => {
  var subFolder = req.params.sub_folder;
  const resData = {};
  var form = new multiparty.Form({
      autoFiles: false, // 요청이 들어오면 파일을 자동으로 저장할 것인가
      uploadDir: 'public/images/'+subFolder+'/',
      maxFilesSize: 1024 * 1024 * 5 // 허용 파일 사이즈 최대치
  });

  form.parse(req, function (error, fields, files) {
      // 파일 전송이 요청되면 이곳으로 온다.
      // 에러와 필드 정보, 파일 객체가 넘어온다.
      console.log(files.file[0].path)
      var path = files.file[0].path.replace(/\\/gi, '/').replace('public', '');
      console.log(path)

      
      return res.status(200).send(path);
  });

};

/**
 * 리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  resData.list = await service.list(req.body);
  return res.render('admin/'+key+'_code/list', resData);
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
  return res.render('admin/'+key+'_code/read', resData);
};

/**
 * 추가
 */
exports.create = async (req, res) => {
  return res.render('admin/'+key+'_code/create');
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
  return res.render('admin/'+key+'_code/update', resData);
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
 * show_yn 수정 공통함수
 */
exports.show = async (req, res) => {
  const record = await service.show(req.params);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
};
