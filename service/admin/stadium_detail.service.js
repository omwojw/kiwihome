var models = require("../../models/index.js");
const key = 'stadium_detail';
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
        sd.detail_seq,
        sd.name stadium_detail_name,
        sd.size,
        sd.show_yn,
        date_format(sd.create_dt, '%Y-%m-%d') create_dt_yyyymmdd,
        (select name from admin where admin_seq = sd.create_by) create_by_nm
    from
        stadium_detail sd
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join area a on s.area_seq = a.area_seq, (SELECT @ROWNUM:=0) TMP 
    where
        sd.delete_yn = 'N'
    order by 
        a.sort asc, s.name asc, sd.name
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
    ,s.stadium_seq
    ,s.area_seq
    ,s.name stadium_name
    ,s.addr
    ,date_format(n.create_dt, '%Y-%m-%d') create_dt_yyyymmdd
    ,date_format(n.update_dt, '%Y-%m-%d') update_dt_yyyymmdd
    ,(select name from admin where admin_seq = n.create_by) create_by_nm
  FROM 
    stadium_detail n
    left join stadium s on n.stadium_seq = s.stadium_seq
    left join area a on s.area_seq = a.area_seq
  where 
    n.detail_seq = ${body.seq}
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
      stadium_detail
		set 
      delete_yn = 'Y'
		where 
      detail_seq = ${body.seq} 
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });

  return rstData;
};



//경기장 리스트
exports.stadium_list = async ( body ) => {
  var query = `
    select
        stadium_seq,
        s.name,
        a.name area_name
    from
        stadium s
        left join area a on s.area_seq = a.area_seq
    where
        s.delete_yn = 'N'
    order by
        a.sort asc, s.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};



//구장 추가
exports.creates = async ( body ) => {
  var query = `
    insert into stadium_detail(stadium_seq, name, size, content, detail_img1, detail_img2, detail_img3, detail_img4, create_dt)
    values(${body.stadium_seq}, '${body.name}', '${body.size}', '${body.content}', '${body.detail_img1}', '${body.detail_img2}', '${body.detail_img3}', '${body.detail_img4}', now())
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

//구장 수정
exports.updates = async ( body ) => {
  var query = `
    update
      stadium_detail
    set
      stadium_seq = ${body.stadium_seq},
      name = '${body.name}',
      size = '${body.size}',
      content = '${body.content}',
      detail_img1 = '${body.detail_img1}',
      detail_img2 = '${body.detail_img2}',
      detail_img3 = '${body.detail_img3}',
      detail_img4 = '${body.detail_img4}'
    where
      detail_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};