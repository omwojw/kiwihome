var models = require("../../models/index.js");

//member_seq로 사용자 정보 가져오기
exports.card = async ( body ) => {
    var query = `
        select
            card_key,
            is_payment,
            card_seq
        from
            card
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            member_seq = ${body.seq}
        order by
            is_payment desc
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
    });
    return rstData;
};

//대표카드 가져오기
exports.is_payment = async ( body ) => {
    var query = `
        select
            card_key,
            is_payment
        from
            card
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            is_payment = 'Y' and
            member_seq = ${body.seq}
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
    });
    return rstData;
};
