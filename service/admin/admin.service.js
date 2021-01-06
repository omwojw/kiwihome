var models = require("../../models/index.js");
const key = 'admin';
//리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,admin_seq
        ,admin_id admin_id
        ,name
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
      from
      admin n, (SELECT @ROWNUM:=0) TMP 
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
  select 
    n.*
    ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
    ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
  FROM 
    admin n
  where 
    admin_seq = ${body.seq}
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
      admin
      (
        admin_id
        ,password
        ,name
        ,create_dt
      )
    values
      (
        '${body.admin_id}'
        ,password('${body.password}')
        ,'${body.name}'
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
      admin
		set 
      admin_id = '${body.admin_id}'
      ,name = '${body.name}'
      ,update_dt = now()
    `;
    if(body.password){
      query += ` ,password = password('${body.password}')`;
    }
    query += `
      ,update_by = ${body.write_by}
		where 
      admin_seq = ${body.seq} 
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