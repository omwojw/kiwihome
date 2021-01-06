var models = require("../../models/index.js");
const key = 'comment';
//후기리스트
exports.warning_list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,comment_seq
        ,(select name from member where member_seq = n.write_seq) write_name
        ,(select name from member where member_seq = n.member_seq) member_name
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,show_yn
        ,content
        ,warning_yn
      from
        comment n, (SELECT @ROWNUM:=0) TMP 
      where 
        delete_yn = 'N' and
        member_seq = ${body.seq}
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

//신고리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,comment_seq
        ,(select name from member where member_seq = n.write_seq) write_name
        ,(select name from member where member_seq = n.member_seq) member_name
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,show_yn
        ,content
        ,warning_yn
      from
        comment n, (SELECT @ROWNUM:=0) TMP 
      where 
        delete_yn = 'N'
      order by 
        case
          when warning_yn = 'Y' then '1'
                else '2'
        end desc,
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
