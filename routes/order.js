var express = require('express');
const orderController = require('../controllers/order')
var router = express.Router();
/* GET users listing. */
router.get('/', orderController.render);
router.post('/', orderController.search);
router.post('/checkout', orderController.checkout);
router.post('/cancel', orderController.cancel);
router.get('/delete/:name', orderController.deleteorder);


module.exports = router;
