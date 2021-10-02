const express = require('express');


const {body} = require('express-validator/check');

const contactViewController = require('../controller/contact-view');

const router = express.Router();


const isAuth = require('../../util/auth');


router.post('/updateViewCount/:contactId', isAuth ,contactViewController.incrementContactViewCount);

router.post('/viewCount/:contactId', isAuth ,contactViewController.viewCount);

router.get('/totalViews/:contactId', isAuth ,contactViewController.totalViewCount);





module.exports = router;