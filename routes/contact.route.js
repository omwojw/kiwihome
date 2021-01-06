const { Router } = require('express');
const router = Router();
const key = 'contact';
const controller = require('../controller/'+key+'.controller');

router.route('/create').post(controller.create);


module.exports = router;