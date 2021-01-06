var models = require("../models/index.js");

//내가 받은 후기 리스트
exports.to = async ( token ) => {
  var query = `
    select
      (select name from member where member_seq = c.write_seq) send_name,
      content,
      date_format(create_dt, '%Y-%m-%d %H:%i') create_dt
    from
      comment c
    where
      warning_yn = 'N' and
      show_yn = 'Y' and
      delete_yn = 'N' and
      member_seq = ${token.member_seq}
    order by
        create_dt desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//내가 작성한 후기 리스트
exports.from = async ( token ) => {
  var query = `
    select
      (select name from member where member_seq = c.member_seq) to_name,
      content,
      date_format(create_dt, '%Y-%m-%d %H:%i') create_dt
    from
      comment c
    where
      warning_yn = 'N' and
      show_yn = 'Y' and
      delete_yn = 'N' and
      write_seq = ${token.member_seq}
    order by
        create_dt desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//추가
exports.create = async ( body, token ) => {
  var query = `
  insert into
    comment
    (
      member_seq
      ,write_seq
      ,content
      ,create_dt
    )
    values
    (
      '${token.member_seq}'
      ,'${body.write_seq}'
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


//신고하기
exports.warning = async ( body ) => {
  var query = `
  update
    comment
  set
    warning_yn = 'Y'
  where
    comment_seq = ${body.comment_seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};