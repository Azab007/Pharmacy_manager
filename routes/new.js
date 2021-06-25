var express = require('express');
const newController = require('../controllers/new')
var router = express.Router();
/* GET users listing. */
router.get('/', newController.render);
router.post('/', newController.new);
module.exports = router;
