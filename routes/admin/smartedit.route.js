const { Router } = require('express');
const router = Router();
const key = 'smartedit';
const controller = require('../../controller/admin/'+key+'.controller');

router.route('/SmartEditor2Skin').get(controller.SmartEditor2Skin);
router.route('/smart_editor2_inputarea').get(controller.smart_editor2_inputarea);
router.route('/photo_uploader').get(controller.photo_uploader);



module.exports = router;