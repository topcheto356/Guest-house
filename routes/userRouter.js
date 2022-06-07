const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//middleware
//it will protect all the routes after this point
router.use(authController.protect);

router.patch(
	'/updateMyPassword',

	authController.updatePassword
);

router.patch('/updateMe', userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

router
	.route('/')
	.get(
		//authController.restricTo('admin')
		userController.getAllUsers
	)
	.post(
		//authController.restricTo('admin')
		userController.createUser
	);

router
	.route('/:id')
	.get(
		//authController.restricTo('admin')
		userController.getUser
	)
	.patch(
		//authController.restricTo('admin')
		userController.updateUser
	)
	.delete(
		//authController.restricTo('admin')
		userController.deleteUser
	);

module.exports = router;
