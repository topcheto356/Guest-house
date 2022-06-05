const express = require('express');
const houseController = require('../controllers/houseController');

const router = express.Router();

router.route('/').post(houseController.createHouse);

module.exports = router;
