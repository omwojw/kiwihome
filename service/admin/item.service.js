var models = require("../../models/index.js");
const key = 'item';
//리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,item_seq
        ,name
        ,price
        ,discription
        ,item_img
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
        ,(select name from admin where admin_seq = n.create_by) create_by_nm
        ,show_yn
      from
        item n, (SELECT @ROWNUM:=0) TMP 
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
    item n
  where 
    item_seq = ${body.seq}
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
      item
      (
        name
        ,price
        ,item_img
        ,discription
        ,create_dt
      )
    values
      (
        '${body.name}'
        ,'${body.price}'
        ,'${body.item_img}'
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
      item
		set 
      name = '${body.name}'
      ,price = '${body.price}'
      ,item_img = '${body.item_img}'
      ,discription = '${body.discription}'
      ,update_dt = now()
		where 
      item_seq = ${body.seq} 
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