const express = require('express');
const houseController = require('../controllers/houseController');

const router = express.Router();

router
	.route('/top-5')
	.get(houseController.topHouses, houseController.getAllHouses);

router
	.route('/')
	.post(houseController.createHouse)
	.get(houseController.getAllHouses);

router
	.route('/:id')
	.delete(houseController.deleteHouse)
	.get(houseController.getHouse)
	.patch(houseController.updateHouse);

module.exports = router;
