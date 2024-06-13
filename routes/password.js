const express = require('express');

const passwordController = require('../controller/password');

const router = express.Router();

router.use('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:id', passwordController.resetPassword);
router.get('/updatepassword/:resetpasswordid', passwordController.updatePassword);

module.exports = router;