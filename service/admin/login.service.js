var models = require("../../models/index.js");

//관리자 로그인
exports.api_login = async ( body ) => {
  var query = `
  select 
				*
		from 
			 admin a
		where
			a.admin_id = '${body.admin_id}' and
			a.password = password('${body.password}') and
			a.show_yn = 'Y' and
			a.delete_yn = 'N'
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};
