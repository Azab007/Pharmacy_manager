var express = require('express');
const homeController = require('../controllers/home')
var router = express.Router();
/* GET users listing. */
router.get('/', homeController.render);
router.post('/', homeController.search);
router.post('/logout', homeController.logout)
router.post('/edit', homeController.edit)
router.post('/save', homeController.save)
router.post('/delete', homeController.delete)

module.exports = router;
