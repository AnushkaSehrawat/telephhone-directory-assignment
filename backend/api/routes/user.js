const express = require('express');


const {body} = require('express-validator/check');

const userController = require('../controller/user');

const router = express.Router();


const isAuth = require('../../util/auth');


router.post('/login', userController.userLogin);

router.get('/listContacts/:userId', isAuth ,userController.listUserContacts);


module.exports = router;