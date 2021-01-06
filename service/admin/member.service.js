var models = require("../../models/index.js");
const key = 'member';
//리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
        @ROWNUM:=@ROWNUM+1 as rownum
        ,member_seq
        ,email
        ,name
        ,phone
        ,sex
        ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
        ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
        ,(select name from admin where admin_seq = n.create_by) create_by_nm
        ,show_yn
        ,(select count(*) cnt from booking where show_yn = 'Y' and delete_yn = 'N' and is_cancel = 'N' and member_seq = n.member_seq) booking_cnt
      from
        member n, (SELECT @ROWNUM:=0) TMP 
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
    ,(select count(*) cnt from booking where show_yn = 'Y' and delete_yn = 'N' and is_cancel = 'N' and member_seq = n.member_seq) booking_cnt
  FROM 
    member n
  where 
    member_seq = ${body.seq}
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
      member
      (
        email
        ,password
        ,name
        ,phone
        ,sex
        ,create_dt
      )
    values
      (
        '${body.email}'
        ,password('${body.password}')
        ,'${body.name}'
        ,'${body.phone}'
        ,'${body.sex}'
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
      member
		set 
      email = '${body.email}'
      ,name = '${body.name}'
      ,phone = '${body.phone}'
      ,sex = '${body.sex}'
      ,update_dt = now()
    `;
    if(body.password){
      query += ` ,password = password('${body.password}')`;
    }
    query += `
		where 
      member_seq = ${body.seq} 
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });

  return rstData;
};


//자주 찾는 경기장
exports.stadium_list = async ( body ) => {
  var query = `
  select
    s.stadium_seq,
    s.name stadium_name,
    s.addr,
    a.name
  from
    bookmark b
    left join stadium s on b.stadium_seq = s.stadium_seq
    left join area a on s.area_seq = a.area_seq
  where
    b.show_yn = 'Y' and
    b.delete_yn = 'N' and
    b.member_seq = ${body.seq}
  order by
    s.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//예약리스트
exports.booking_list = async ( body ) => {
  var query = `
  select
        b.is_cancel,
        date_format(b.create_dt, '%Y-%m-%d %H:%i') create_dt,
        p.play_seq,
        p.play_day,
        p.start_time,
        p.end_time,
        p.is_play,
        s.name stadium_name,
        sd.name detail_name,
        m.member_seq,
        m.name member_name,
        count(*) booking_cnt,
        a.name name,
        ma.name maneger_name
    from
        booking b
        left join play p on b.play_seq = p.play_seq
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger ma on p.maneger_seq = ma.maneger_seq
        left join member m on b.member_seq = m.member_seq
        left join area a on s.area_seq = a.area_seq
    where
        b.show_yn = 'Y' and
        b.delete_yn = 'N' and
        b.member_seq = '${body.seq}'
    group by
        b.is_cancel,
        date_format(b.create_dt, '%Y-%m-%d %H:%i'),
        p.play_seq,
        p.play_day,
        p.start_time,
        p.end_time,
        s.name,
        sd.name ,
        m.member_seq,
        m.name 
    order by
        p.play_day desc, start_time desc
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