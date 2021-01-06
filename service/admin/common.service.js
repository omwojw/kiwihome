var models = require("../../models/index.js");
const key = 'common';
//리스트
exports.list = async ( body ) => {
  var query = `
  select
    *
  from(
    select
      @ROWNUM:=@ROWNUM+1 as rownum
      ,common_seq
      ,name
      ,code
      ,sub_code
      ,discription
      ,sort
      ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
      ,(select name from admin where admin_seq = n.create_by) create_by_nm
      ,show_yn
    from
      common n, (SELECT @ROWNUM:=0) TMP 
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
		  ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
      ,(select name from admin where admin_seq = n.create_by) create_by_nm
		FROM 
			common n
		where 
			common_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//추가
exports.creates = async ( body ) => {
  var query = `
    insert into
      common
      (
        name
        ,code
        ,sub_code
        ,sort
        ,discription
        ,create_dt
      )
    values
      (
        '${body.name}'
        ,'${body.code}'
        ,'${body.sub_code}'
        ,'${body.sort}'
        ,'${body.discription}'
        ,now()
      )
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

//수정
exports.updates = async ( body ) => {
  var query = `
  update 
      common
	set 
      name = '${body.name}'
      ,code = '${body.code}'
      ,sub_code = '${body.sub_code}'
      ,sort = '${body.sort}'
      ,discription = '${body.discription}'
      ,update_dt = now()
      ,update_by = ${body.write_by}
  where 
      common_seq = ${body.seq} 
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
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


//수정
exports.show = async ( body ) => {
  var query = `
  update 
			${body.table_name}
		set 
			show_yn = '${body.value}'
		where 
			${body.table_seq_name} = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });

  return rstData;
};