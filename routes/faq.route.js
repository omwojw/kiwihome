const { Router } = require('express');
const router = Router();
const key = 'faq';
const controller = require('../controller/'+key+'.controller');

router.route('').get(controller.list);

module.exports = router;