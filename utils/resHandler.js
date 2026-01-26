const resHandler = {
    success: (res, message, data = null, statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data
        });
    },

    error: (res, statusCode = 400, message, data = undefined) => {
        res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            data
        });
    }
};

module.exports = resHandler;
