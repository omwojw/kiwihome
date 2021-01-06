var models = require("../../models/index.js");
const key = 'faq';
//리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,faq_seq
        ,title
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
        ,(select name from admin where admin_seq = n.create_by) create_by_nm
        ,(select name from common where common_seq = n.common_seq) common_name
        ,show_yn
      from
        faq n, (SELECT @ROWNUM:=0) TMP 
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
    ,(select name from common where common_seq = n.common_seq) common_name
  FROM 
    faq n
  where 
    faq_seq = ${body.seq}
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
      faq
      (
        title
        ,common_seq
        ,content
        ,create_dt
      )
    values
      (
        '${body.title}'
        ,'${body.common_seq}'
        ,'${body.content}'
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
  update faq
    set 
      title = '${body.title}'
      ,common_seq = '${body.common_seq}'
      ,content = '${body.content}'
      ,update_dt = now()
  where 
    faq_seq = ${body.seq}
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


//faq 카테고리 리스트
exports.common_list = async ( body ) => {
  var query = `
  select
   common_seq,
   name
  from
    common n
  where 
    delete_yn = 'N' and
    show_yn = 'Y' and
    code = 'FAQ'
  order by 
    name asc;
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};