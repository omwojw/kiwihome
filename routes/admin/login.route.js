const { Router } = require('express');
const router = Router();

const controller = require('../../controller/admin/login.controller');

router.route('/logout').get(controller.logout);
router.route('/api/v1/login').post(controller.api_login);

module.exports = router;