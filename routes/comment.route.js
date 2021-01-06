const { Router } = require('express');
const router = Router();

const controller = require('../controller/comment.controller');

router.route('/to').get(controller.to);
router.route('/from').get(controller.from);
router.route('/create').post(controller.create);
router.route('/warning').post(controller.warning);
module.exports = router;