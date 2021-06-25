var express = require('express');
const loginController = require('../controllers/login')
var router = express.Router();

/* GET users listing. */
router.get('/', loginController.render);
router.post('/', loginController.login);
module.exports = router;
