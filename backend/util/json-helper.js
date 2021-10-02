const jsonData = (statusCode, message, data) => {
    return {
        status_code: statusCode,
        message: message,
        data: data
    }
};

module.exports = jsonData;