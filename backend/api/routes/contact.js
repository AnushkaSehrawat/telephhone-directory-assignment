const express = require('express');


const {body} = require('express-validator/check');

const contactController = require('../controller/contact');

const router = express.Router();


const isAuth = require('../../util/auth');


router.post('/createContact', isAuth ,[
    body("first_name")
        .not()
        .isEmpty()
        .withMessage("Empty First Name"),
    body("last_name")
        .not()
        .isEmpty()
        .withMessage("Empty Last Name")
],contactController.createContact);

router.get("/contact/:contactId", isAuth,contactController.detail);

router.post("/sort", isAuth,contactController.sortByAttribute);

router.get("/search", isAuth, contactController.searchByAttribute);

router.get("/headerData", isAuth, contactController.getHeaderData);


module.exports = router;