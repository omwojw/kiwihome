var models = require("../../models/index.js");
const key = 'stadium';
//경기장 리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
          @ROWNUM:=@ROWNUM+1 as rownum,
          a.name area_name,
          s.stadium_seq,
          s.area_seq,
          s.name stadium_name,
          s.addr,
          s.director_name,
          s.director_phone,
          s.director_url,
          (select count(*) cnt from stadium_detail where stadium_seq = s.stadium_seq and delete_yn = 'N' and show_yn = 'Y') cnt,
          s.show_yn,
          date_format(s.create_dt, '%Y-%m-%d') create_dt_yyyymmdd,
          (select name from admin where admin_seq = s.create_by) create_by_nm,
          (select name from common where common_seq = s.sports) sports
      from
          stadium s
          left join area a on s.area_seq = a.area_seq, (SELECT @ROWNUM:=0) TMP 
      where
          s.delete_yn = 'N'
      order by 
          s.create_dt asc
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
    ,a.name area_name
    ,date_format(n.create_dt, '%Y-%m-%d') create_dt_yyyymmdd
    ,date_format(n.update_dt, '%Y-%m-%d') update_dt_yyyymmdd
    ,(select name from admin where admin_seq = n.create_by) create_by_nm
    ,(select count(*) cnt from stadium_detail where stadium_seq = n.stadium_seq and delete_yn = 'N' and show_yn = 'Y') cnt
    ,(select name from common where common_seq = n.sports) sports
    ,(select common_seq from common where common_seq = n.sports) sports_code
  FROM 
    stadium n
    left join area a on n.area_seq = a.area_seq
  where 
    n.stadium_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//구장 리스트
exports.stadium_detail_list = async ( body ) => {
  var query = `
      select
          sd.detail_seq,
          sd.name stadium_detail_name,
          sd.size,
          sd.show_yn,
          (select count(*) cnt from play where detail_seq = sd.detail_seq) yescnt,
          (select count(*) cnt from play where detail_seq = sd.detail_seq and is_play = 'N') nocnt
      from
          stadium_detail sd
      where
          sd.delete_yn = 'N' and
          sd.stadium_seq = ${body.seq}
      order by 
          sd.name asc
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



//지역 리스트
exports.area_list = async ( body ) => {
  var query = `
    select
        area_seq,
        name
    from
        area
    where
        delete_yn = 'N'
    order by
        sort asc, name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};



//경기장 추가
exports.creates = async ( body ) => {
  var query = `
    insert into stadium(area_seq, name, addr, create_dt, sports, director_name, director_phone, director_url)
    values(${body.area_seq}, '${body.name}', '${body.addr}', now(), '${body.sports}', '${body.director_name}', '${body.director_phone}', '${body.director_url}')
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

//경기장 수정
exports.updates = async ( body ) => {
  var query = `
    update
      stadium
    set
      area_seq = ${body.area_seq},
      name = '${body.name}',
      sports = '${body.sports}',
      director_name = '${body.director_name}',
      director_phone = '${body.director_phone}',
      director_url = '${body.director_url}',
      addr = '${body.addr}'
    where
      stadium_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

exports.sports_list = async ( body ) => {
  var query = `
  select
   common_seq,
   name
  from
    common n
  where 
    delete_yn = 'N' and
    show_yn = 'Y' and
    code = 'SPORTS'
  order by 
    name asc;
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};