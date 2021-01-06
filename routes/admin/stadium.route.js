const { Router } = require('express');
const router = Router();
const key = 'stadium';
const controller = require('../../controller/admin/'+key+'.controller');

router.route('/list').get(controller.list);
router.route('/read/:seq').get(controller.read);
router.route('/remove/:seq').get(controller.remove);

router.route('/create').get(controller.create);
router.route('/create').post(controller.creates);

router.route('/update/:seq').get(controller.update);
router.route('/update').post(controller.updates);


module.exports = router;