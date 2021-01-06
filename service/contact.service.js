var models = require("../models/index.js");
const key = 'contact';
//추가
exports.create = async ( body ) => {
  var query = `
  insert into
    contact
    (
      common_seq
      ,phone
      ,email
      ,file_url
      ,create_dt
    )
    values
    (
      '${body.common_seq}'
      ,'${body.phone}'
      ,'${body.email}'
      ,'${body.file_url}'
      ,now()
    )
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });

  return rstData;
};