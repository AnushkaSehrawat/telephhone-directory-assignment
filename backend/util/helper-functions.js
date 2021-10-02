const moment = require('moment');
const {validationResult} = require('express-validator/check');

const constants = require('./constants');
const statusCodes = require('./status-codes');

exports.checkValidationError = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.error = errors.array();
        error.statusCode = statusCodes.BAD_REQUEST;
        return error;
    } else {
        return null;
    }
};


exports.getIstTimeStampUnix = () => {
    return moment().format(constants.UNIX_FORMAT);
};