var models = require("../../models/index.js");
const key = 'maneger';
//리스트
exports.list = async ( body ) => {
  var query = `
  select
    *
  from(
    select
      @ROWNUM:=@ROWNUM+1 as rownum
      ,n.maneger_seq
      ,n.email
      ,n.name
      ,n.phone
      ,n.is_item
      ,n.access_yn
      ,date_format(n.create_dt, '%Y-%m-%d') create_dt_yyyymmdd
      ,date_format(n.update_dt, '%Y-%m-%d') update_dt_yyyymmdd
      ,(select name from admin where admin_seq = n.create_by) create_by_nm
      ,n.show_yn
      ,(select count(*) cnt from play where show_yn = 'Y' and delete_yn = 'N'  and maneger_seq = n.maneger_seq and is_play = 'Y') play_cnt
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
      ) bookmark_stadium,
      (select name from common where common_seq = n.sports) sports,
      (select count(*) cnt from play where show_yn = 'Y' and delete_yn = 'N' and maneger_seq = n.maneger_seq and is_play = 'Y' and date_format(now(), '%Y%m') = date_format(play_day, '%Y%m')) month_play_cnt,
      (select count(*)*30000 cnt from play where show_yn = 'Y' and delete_yn = 'N' and maneger_seq = n.maneger_seq and is_play = 'Y' and date_format(now(), '%Y%m') = date_format(play_day, '%Y%m')) month_play_price,
      (select name from common where common_seq = n.bank_name) bank_names,
      n.bank_number
    from
      maneger n, (SELECT @ROWNUM:=0) TMP 
    where 
      n.delete_yn = 'N'
    order by 
      n.create_dt asc
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
    ,(select name from common where common_seq = n.bank_name) bank_names
    ,date_format(create_dt, '%Y-%m-%d') create_dt_yyyymmdd
    ,date_format(update_dt, '%Y-%m-%d') update_dt_yyyymmdd
    ,(select name from admin where admin_seq = n.create_by) create_by_nm
    ,(select count(*) cnt from play where show_yn = 'Y' and delete_yn = 'N'  and maneger_seq = n.maneger_seq) play_cnt
    ,(select name from common where common_seq = n.sports) sports
    ,(select common_seq from common where common_seq = n.sports) sports_code
  FROM 
    maneger n
  where 
    maneger_seq = ${body.seq}
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
      maneger
      (
        email
        ,password
        ,name
        ,phone
        ,access_yn
        ,maneger_img
        ,content
        ,sports
        ,is_item
        ,bank_name
        ,bank_number
        ,create_dt
      )
    values
      (
        '${body.email}'
        ,password('${body.password}')
        ,'${body.name}'
        ,'${body.phone}'
        ,'${body.access_yn}'
        ,'${body.maneger_img}'
        ,'${body.content}'
        ,'${body.sports}'
        ,'${body.is_item}'
        ,'${body.bank_name}'
        ,'${body.bank_number}'
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
      maneger
		set 
      email = '${body.email}'
      ,name = '${body.name}'
      ,phone = '${body.phone}'
      ,access_yn = '${body.access_yn}'
      ,sports = '${body.sports}'
      ,bank_name = '${body.bank_name}'
      ,bank_number = '${body.bank_number}'
      ,update_dt = now()
		where 
      maneger_seq = ${body.seq} 
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



//자주 찾는 경기장
exports.maneger_bookmark_list = async ( body ) => {
  var query = `
  select
    s.stadium_seq,
    s.name stadium_name,
    s.addr,
    a.name,
    b.time
  from
    maneger_bookmark b
    left join stadium s on b.stadium_seq = s.stadium_seq
    left join area a on s.area_seq = a.area_seq
  where
    b.show_yn = 'Y' and
    b.delete_yn = 'N' and
    b.maneger_seq = ${body.seq}
  order by
    s.name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//내 매치리스트
exports.play_list = async ( body ) => {
  var query = `
  select
        date_format(p.create_dt, '%Y-%m-%d %H:%i') create_dt,
        p.play_seq,
        p.play_day,
        p.start_time,
        p.end_time,
        p.is_play,
        p.min,
        p.max,
        s.name stadium_name,
        sd.name detail_name,
        a.name name,
        ma.name maneger_name,
        (select count(*) cnt from booking where show_yn = 'Y' and delete_yn = 'N' and is_cancel = 'N' and play_seq = p.play_seq) booking_cnt
    from
        play p
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger ma on p.maneger_seq = ma.maneger_seq
        left join area a on s.area_seq = a.area_seq
    where
        p.show_yn = 'Y' and
        p.delete_yn = 'N' and
        p.maneger_seq = ${body.seq}
    order by
        p.play_day desc, start_time desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//물품 리스트
exports.item_list = async ( body ) => {
  var query = `
  select
    item_seq,
    name,
    discription,
    price,
    item_img
  from
    item
  where
    show_yn = 'Y' and
    delete_yn = 'N'
  order by
    create_dt desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//마지막 레코드
exports.last_read = async ( body ) => {
  var query = `
  select
    maneger_seq
  from
    maneger
  order by
    create_dt desc
  limit
    0, 1
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//매니저 물품 전체삭제
exports.deletes_use = async ( body ) => {
  var query = `
    update 
      maneger_item_use
    set
      delete_yn = 'Y'
    where
      maneger_seq = ${body.seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

//매니저에게 물품부여
exports.creates_use = async ( body, maneger ) => {
  var query = `
    insert into
      maneger_item_use
      (
        maneger_seq
        ,item_seq
        ,cnt
        ,create_dt
      )
    values
  `;
    for(var i = 0 ; i < body.use_list.length ; i++){
      query+=`
      (
        '${maneger.maneger_seq}'
        ,'${body.use_list[i].item_seq}'
        ,'${body.use_list[i].cnt}'
        ,now()
      ),`;
    }

  query = query.substring(0, (query.length-1))
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};

//매니저 물품리스트
exports.maneger_item_list = async ( body ) => {
  var query = `
  select
    i.item_seq,
    i.name,
    i.price,
    i.item_img,
    miu.cnt,
    (select sum(cnt*price) from maneger_item_use where maneger_seq = miu.maneger_seq and show_yn = 'Y' and delete_yn = 'N') total_price
  from
    maneger_item_use miu
    left join item i on miu.item_seq = i.item_seq
  where
    miu.show_yn = 'Y' and
    miu.delete_yn = 'N' and
    miu.maneger_seq = ${body.seq}
  order by
    miu.create_dt desc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//은행리스트
exports.bank_list = async ( body ) => {
  var query = `
  select
    common_seq,
    name
  from
    common
  where
    show_yn = 'Y' and
    delete_yn = 'N' and
    code = 'BANK'
  order by
    name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};
