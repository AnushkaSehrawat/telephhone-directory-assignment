const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

const Users = require("./models/user");
const Contacts = require("./models/contact");
const ContactViews = require("./models/contact-view");
const api = require('./api/routes');

require('dotenv').config();

const app = express();
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use('/api', api);

//error handling
app.use((err, req, res, next) => {
    console.log(err);

    const status = err.statusCode || 500;
    const error = err.error || "No error provided";
    const message = err.message || "No message provided";

    res.status(status).json({
        status_code: status,
        error: error,
        message: message
    });
});


Users.hasMany(Contacts);
Contacts.hasMany(ContactViews, {as: 'ContactView'});

sequelize
    .sync()
    .then(result => {
        const port = process.env.PORT || 8081 ;
        app.listen(port);
        console.log("API WORKING AT PORT : " + port);
    })
    .catch(err => {
        console.log("ERROR!!");
        console.log(err);
    });
