var models = require("../../models/index.js");
const key = 'play';
//매치 리스트
exports.list = async ( body ) => {
  var query = `
    select
      *
    from(
      select
          @ROWNUM:=@ROWNUM+1 as rownum,
          p.play_seq,
          s.name,
          sd.name detail_name,
          p.sex,
          p.start_time,
          p.end_time,
          p.levels,
          p.cnt,
          p.play_opt,
          p.play_day,
          p.price,
          (select count(*) cnt from booking where p.play_seq = play_seq and show_yn = 'Y' and delete_yn = 'N' and is_cancel = 'N') booking_cnt,
          (select count(*) cnt from wait where p.play_seq = play_seq and show_yn = 'Y' and delete_yn = 'N') wait_cnt,
          m.name maneger_name,
          p.show_yn,
          date_format(p.create_dt, '%Y-%m-%d') create_dt_yyyymmdd,
          (select name from admin where admin_seq = p.create_by) create_by_nm,
          (select name from common where common_seq = p.sports) sports
      from
          play p
          left join stadium_detail sd on p.detail_seq = sd.detail_seq
          left join stadium s on sd.stadium_seq = s.stadium_seq
          left join maneger m on p.maneger_seq = m.maneger_seq, (SELECT @ROWNUM:=0) TMP 
      where
          p.delete_yn = 'N'
      order by
        p.play_day asc, p.start_time asc
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
    p.*
    ,s.name
    ,sd.name detail_name
    ,(select count(*) cnt from booking where p.play_seq = play_seq) booking_cnt
    ,m.name maneger_name
    ,date_format(p.create_dt, '%Y-%m-%d') create_dt_yyyymmdd
    ,date_format(p.update_dt, '%Y-%m-%d') update_dt_yyyymmdd
    ,(select name from admin where admin_seq = p.create_by) create_by_nm
    ,(select name from common where common_seq = p.sports) sports
    ,(select common_seq from common where common_seq = p.sports) sports_code
  FROM 
    play p
    left join stadium_detail sd on p.detail_seq = sd.detail_seq
    left join stadium s on sd.stadium_seq = s.stadium_seq
    left join maneger m on p.maneger_seq = m.maneger_seq
  where 
    p.play_seq = ${body.seq}
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
      play
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



//예약자 리스트
exports.booking_list = async ( body ) => {
  var query = `
    select
        b.chk,
        b.is_cancel,
        m.name,
        count(*) cnt
    from
        booking b
        left join play p on b.play_seq = p.play_seq
        left join member m on b.member_seq = m.member_seq
    where
        b.delete_yn = 'N' and
        b.play_seq = ${body.seq}
    group by
        b.chk,
        b.is_cancel,
        m.name
    order by
        m.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//대기자 리스트
exports.wait_list = async ( body ) => {
  var query = `
    select
        m.member_seq,
        m.name,
        count(*) cnt
    from
        wait b
        left join member m on b.member_seq = m.member_seq
    where
        b.delete_yn = 'N' and
        b.play_seq = ${body.seq}
    group by
      m.member_seq,
      m.name
    order by
        m.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//매치 추가
exports.creates = async ( body ) => {
  var query = `
    insert into play(parking, sports, play_day, start_time, end_time, detail_seq, sex, levels, cnt, play_opt, create_dt, maneger_seq, min, max, show_yn, price)
    values('${body.parking}', '${body.sports}', '${body.play_day}', '${body.start_time}', '${body.end_time}', '${body.detail_seq}', '${body.sex}', '${body.levels}', '${body.cnt}', '${body.play_opt}', now(), '${body.maneger_seq}', '${body.min}', '${body.max}', 'N', '${body.price}')
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};


//매치 수정
exports.updates = async ( body ) => {
  var query = `
    update
      play
    set
      parking = '${body.parking}',
      play_day = '${body.play_day}',
      start_time = '${body.start_time}',
      end_time = '${body.end_time}',
      detail_seq = '${body.detail_seq}',
      sex = '${body.sex}',
      levels = '${body.levels}',
      cnt = '${body.cnt}',
      play_opt = '${body.play_opt}',
      maneger_seq = '${body.maneger_seq}',
      min = '${body.min}',
      price = '${body.price}',
      sports = '${body.sports}',
      max = '${body.max}'
    where
      play_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};



exports.stadium_detail_list = async ( body ) => {
  var query = `
  select
    a.name area_name,
    s.name stadium_name,
    sd.detail_seq,
    sd.name stadium_detail_name
  from
    stadium_detail sd
    left join stadium s on sd.stadium_seq = s.stadium_seq
    left join area a on s.area_seq = a.area_seq
  where
    sd.delete_yn = 'N' and
    sd.show_yn = 'Y'
  order by 
    a.sort asc, s.name asc, sd.name
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

exports.maneger_list = async ( body ) => {
  var query = `
  select
    maneger_seq
    ,name
    ,phone
    ,(
			SELECT 
				GROUP_CONCAT( concat(s.name, '(', mb.time, ')') SEPARATOR  ' | ' )
			FROM 
				maneger_bookmark mb
				left join stadium s on mb.stadium_seq = s.stadium_seq
      where
				mb.maneger_seq = n.maneger_seq and
        mb.delete_yn = 'N' and
        mb.show_yn = 'Y'
			GROUP BY 
				maneger_seq
    ) bookmark_stadium
  from
    maneger n
  where 
    delete_yn = 'N' and
    show_yn = 'Y' and
    access_yn = 'Y' and
    is_item = 'Y'
  order by 
    name asc;
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
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
    name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

/**
 * 
 * 주차 리스트
 */
exports.park_list = async ( body ) => {
  var query = `
  select
    b.park_number, 
    b.play_seq ,
    m.member_seq,
    m.name
  from 
    booking b
    left join member m on b.member_seq = m.member_seq
  where  
    b.is_cancel = 'N' and 
    b.show_yn = 'Y' and 
    b.delete_yn = 'N' and 
    b.park_number is not null and
    b.park_number != '' and
    b.play_seq = 66
  group by 
    b.park_number,
    b.play_seq,
    m.member_seq,
    m.name
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};