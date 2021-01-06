const { Router } = require('express');
const router = Router();

const controller = require('../../controller/admin/index.controller');

router.route('').get(controller.index);

module.exports = router;