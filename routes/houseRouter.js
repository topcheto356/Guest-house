const express = require('express');

const authController = require('../controllers/authController');
const houseController = require('../controllers/houseController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router.use('/:houseId/reviews', reviewRouter);

router
	.route('/top-5')
	.get(houseController.topHouses, houseController.getAllHouses);

router
	.route('/')
	.get(houseController.getAllHouses)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'owner'),
		houseController.createHouse
	);

router
	.route('/:id')
	.get(houseController.getHouse)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'owner'),
		houseController.deleteHouse
	)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'owner'),
		houseController.updateHouse
	);

module.exports = router;
