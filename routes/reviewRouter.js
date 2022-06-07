const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();
//only authenticated users can access to reviews
router.use(authController.protect);

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(reviewController.createReview);

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(reviewController.updateReview)
	.delete(reviewController.deleteReview);

module.exports = router;
