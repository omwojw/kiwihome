var models = require("../models/index.js");
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
        ,content
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,(select name from admin where admin_seq = n.create_by) create_by_nm
        ,(select name from common where common_seq = n.common_seq) common_name
      from
        faq n, (SELECT @ROWNUM:=0) TMP 
      where 
        show_yn = 'Y' and
        delete_yn = 'N'
      `;

      if(body.common_seq){
        query += ` and common_seq = ${body.common_seq} `;
      }

      query += `
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
