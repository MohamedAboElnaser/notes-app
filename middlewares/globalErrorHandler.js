const sendDevelopmentError = (err, res, req) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        errStack: err.stack,
    });
};

const sendProductionError = (err, req, res) => {
    //operational errors that are trusted, send it to the client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    //programming errors [come from 3rd part library may be] we do not leak them to the client
    console.error("Error happen :", err);
    res.status(500).json({
        status: "error",
        message: "something went wrong!!!!!",
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development")
        sendDevelopmentError(err, res, req);
    else sendProductionError(err, req, res);
};
