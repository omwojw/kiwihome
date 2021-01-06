const { Router } = require('express');
const router = Router();

const controller = require('../controller/maneger_bookmark.controller');

router.route('').post(controller.list);
router.route('/create').post(controller.create); 
module.exports = router;