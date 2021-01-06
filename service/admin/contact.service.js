var models = require("../../models/index.js");
const key = 'contact';
//리스트
exports.list = async ( body ) => {
  var query = `
  select
    *
  from(
    select
      @ROWNUM:=@ROWNUM+1 as rownum
      ,contact_seq
      ,phone
      ,email
      ,(select name from common where common_seq = n.common_seq) name
      ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
    from
      contact n, (SELECT @ROWNUM:=0) TMP 
    where 
      delete_yn = 'N'
    order by 
      create_dt asc
    ) sub
    order by
    rownum desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//상세
exports.read = async ( body ) => {
  var query = `
    SELECT 
			n.*
			,(select name from common where common_seq = n.common_seq) name
		  ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
		FROM 
			contact n
		where 
			contact_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//삭제
exports.remove = async ( body ) => {
  var query = `
    update 
      ${key}
		set 
      delete_yn = 'Y'
		where 
      ${key}_seq = ${body.seq} 
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });

  return rstData;
};