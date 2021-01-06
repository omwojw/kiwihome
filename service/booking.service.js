var models = require("../models/index.js");

//매니저 입장 매치에 대한 예약자 리스트
exports.maneger_list = async (body) => {
    var query = `
      select
          b.booking_seq,
          b.chk,
          b.is_cancel,
          date_format(b.create_dt, '%Y-%m-%d %H:%i:%s') create_dt,
          p.play_seq,
          p.play_day,
          p.start_time,
          p.end_time,
          s.name,
          sd.name detail_name,
          m.member_seq,
          m.name member_name
      from
          booking b
          left join play p on b.play_seq = p.play_seq
          left join stadium_detail sd on p.detail_seq = sd.detail_seq
          left join stadium s on sd.stadium_seq = s.stadium_seq
          left join maneger ma on p.maneger_seq = ma.maneger_seq
          left join member m on b.member_seq = m.member_seq
      where
          b.show_yn = 'Y' and
          b.delete_yn = 'N' and
          b.play_seq = '${body.play_seq}' and 
          b.is_cancel = 'N'
        order by
            m.name asc
      `;
      
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      raw: true,
    });
  
    return rstData;
  };



//사용자 입장 내 예약 리스트
exports.list = async (body) => {
  var query = `
    select
        b.is_cancel,
        date_format(b.create_dt, '%Y-%m-%d') create_dt,
        p.play_seq,
        p.play_day,
        p.start_time,
        p.end_time,
        s.name,
        sd.name detail_name,
        m.member_seq,
        m.name member_name,
        count(*) booking_cnt
    from
        booking b
        left join play p on b.play_seq = p.play_seq
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger ma on p.maneger_seq = ma.maneger_seq
        left join member m on b.member_seq = m.member_seq
    where
        b.show_yn = 'Y' and
        b.delete_yn = 'N' and
        b.member_seq = '${body.member_seq}'
    group by
        b.is_cancel,
        date_format(b.create_dt, '%Y-%m-%d'),
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

//해당 매치 몇명 예약햇는지 가져오기
exports.booking_cnt = async (body) => {
  var query = `
    select 
        count(*) cnt,
        p.max
    from 
        booking b
        left join play p on b.play_seq = p.play_seq
    where 
        b.play_seq = ${body.play_seq} and
        b.show_yn = 'Y' and
        b.delete_yn = 'N' and
        b.is_cancel = 'N'
    `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//해당 매치 몇명 대기 예약햇는지 가져오기
exports.wait_cnt = async (body) => {
  var query = `
    select 
        count(*) cnt
    from 
        wait w
        left join play p on w.play_seq = p.play_seq
    where 
        w.play_seq = ${body.play_seq} and
        w.show_yn = 'Y' and
        w.delete_yn = 'N'
    `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

//예약하기
exports.create = async ( body, token, payment) => {
    var query = `
      insert into booking(member_seq, play_seq, create_dt, imp_uid, park_number) 
      values
    `;
    for(var i = 0 ; i < body.cnt ; i++){
      body.park_number = body.park_number ? body.park_number : '';
        query+=`( '${token.member_seq}', '${body.play_seq}', now(), '${payment.imp_uid}', '${body.park_number}'),`;  
    }  
    query = query.substring(0, (query.length-1));
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.create,
      raw: true,
    });
    return rstData;
};

//대기 예약하기
exports.wait_create = async ( body, token) => {
  var query = `
    insert into wait(member_seq, play_seq, create_dt) 
    values
  `;
  for(var i = 0 ; i < body.cnt ; i++){
      query+=`( '${token.member_seq}', '${body.play_seq}', now()),`;  
  }  
  query = query.substring(0, (query.length-1));
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });
  return rstData;
};


//예약취소 imp_uid 가져오기   
exports.impuids = async ( body, token ) => {
  var query = `
    select
      imp_uid
    from
      booking
    where
      show_yn = 'Y' and
      delete_yn = 'N' and
      is_cancel = 'N' and
      play_seq = ${body.play_seq} and
      member_seq = ${token.member_seq}
    group by
      imp_uid
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });
  return rstData;
};

//예약취소
exports.delete = async ( body, token ) => {
  var query = `
    update
      booking
    set
      is_cancel = 'Y'
    where
      play_seq = ${body.play_seq} and
      member_seq = ${token.member_seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });
  return rstData;
};

//남은자리 개수 가져오기
exports.yes_cnt = async ( body ) => {
  var query = `
    select 
      max
      -
      (select count(*) cnt from booking where play_seq = p.play_seq and show_yn = 'Y' and delete_yn = 'N' and is_cancel = 'N')
      cnt
    from 
      play p
    where
      play_seq = ${body.play_seq} and
      show_yn = 'Y' and
      delete_yn = 'N'
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
      member_seq,
      count(*) cnt,
      date_format(create_dt, '%Y%m%d%H%i') create_dt
    from 
      wait p
    where
      play_seq = ${body.play_seq} and
      show_yn = 'Y' and
      delete_yn = 'N'
    group by
      member_seq,
      date_format(create_dt, '%Y%m%d%H%i')
    order by
      date_format(create_dt, '%Y%m%d%H%i')
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });
  return rstData;
};



//대기예약취소
exports.wait_delete = async ( body, token ) => {
  var query = `
    update
      wait
    set
      show_yn = 'N'
    where
      play_seq = ${body.play_seq} and
      member_seq = ${token.member_seq}
  `;
  query = query.substring(0, (query.length-1));
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });
  return rstData;
};

