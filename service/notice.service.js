var models = require("../models/index.js");
const key = 'notice';
//리스트
exports.list = async ( body ) => {
  var query = `
  select
    *
  from(
    select
      @ROWNUM:=@ROWNUM+1 as rownum
      ,notice_seq
      ,title
      ,view_cnt
      ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,(select name from admin where admin_seq = n.create_by) create_by_nm
    from
      notice n, (SELECT @ROWNUM:=0) TMP 
    where 
      show_yn = 'Y' and
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
		  ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,(select name from admin where admin_seq = n.create_by) create_by_nm
		FROM 
			notice n
		where 
			notice_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};
