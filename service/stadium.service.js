var models = require("../models/index.js");

//경기장 리스트
exports.list = async ( body ) => {
  var query = `
    select
        s.stadium_seq,
        s.area_seq,
        s.name,
        s.addr,
        (select name from common where common_seq = s.sports) sports
    from
        stadium s
        left join area a on s.area_seq = a.area_seq
    where
        s.show_yn = 'Y' and
        s.delete_yn = 'N'
        `;
    if(body.sports != null){
          query +=` and s.sports = ${body.sports}`;    
    }
    if(body.area_seq != null){
        query +=` and s.area_seq = ${body.area_seq}`;    
    }
    query +=`
    order by
        a.sort asc, s.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

