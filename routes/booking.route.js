const { Router } = require('express');
const router = Router();

const controller = require('../controller/booking.controller');

router.route('').get(controller.list);
router.route('/maneger').post(controller.maneger_list);
router.route('/create').post(controller.create);
router.route('/delete').post(controller.delete);

router.route('/wait/create').post(controller.wait_create);
router.route('/wait/delete').post(controller.wait_delete);
module.exports = router;