const express = require('express');

const authController = require('../controllers/authController');
const houseController = require('../controllers/houseController');

const router = express.Router();

router
	.route('/top-5')
	.get(houseController.topHouses, houseController.getAllHouses);

router
	.route('/')
	.get(houseController.getAllHouses)
	.post(authController.protect, houseController.createHouse);

router
	.route('/:id')
	.get(houseController.getHouse)
	.delete(authController.protect, houseController.deleteHouse)
	.patch(authController.protect, houseController.updateHouse);

module.exports = router;
