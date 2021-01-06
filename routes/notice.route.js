const { Router } = require('express');
const router = Router();
const key = 'notice';
const controller = require('../controller/'+key+'.controller');

router.route('').get(controller.list);
router.route('/:seq').get(controller.read);


module.exports = router;