const jwt = require('jsonwebtoken');
const User = require('../models/user');

const statusCodes = require('../util/status-codes');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Authorization header missing');
            error.error = "Authorization error";
            error.statusCode = statusCodes.UNAUTHORIZED;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        let decodedToken;
        decodedToken = jwt.verify(token, process.env.TOKEN_GENERATION_KEY);
        if (!decodedToken) {
            const error = new Error("Token Invalid");
            error.error = "Authorization error";
            error.statusCode = statusCodes.UNAUTHORIZED;
            throw error;
        }

        if (decodedToken.userId) {
            req.userId = decodedToken.userId;
            req.user = await User.findOne({
                where: {id: decodedToken.userId}
            });

            if (!req.user) {
                const error = new Error("No user found while authorization");
                error.error = "User Null";
                error.statusCode = statusCodes.UNAUTHORIZED;
                throw error;
            }
        } else {
            const error = new Error("No userId found while authorization");
            error.error = "UserId Null";
            error.statusCode = statusCodes.UNAUTHORIZED;
            throw error;
        }

        next();
    } catch (err) {
        const error = new Error(err.message || 'Authorization failed');
        error.error = err.error || "Authorization Error";
        error.statusCode = err.statusCode || statusCodes.UNAUTHORIZED;

        next(error);
    }

};