const { Router } = require('express');
const router = Router();
const key = 'warning';
const controller = require('../../controller/admin/'+key+'.controller');

router.route('/list').get(controller.list);
router.route('/remove/:seq').get(controller.remove);


module.exports = router;