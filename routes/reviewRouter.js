const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const express = require('express');
const { append } = require('express/lib/response');

const router = express.Router();

//only authenticated users can access to reviews
router.use(authController.protect);

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(
		authController.restrictTo('user'),
		reviewController.setHouseUserIds,
		reviewController.createReview
	);

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(
		authController.restrictTo('user', 'admin'),
		reviewController.updateReview
	)
	.delete(
		authController.restrictTo('user', 'admin'),
		reviewController.deleteReview
	);

module.exports = router;
