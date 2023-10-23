const { catchAsync } = require("../util/catch-async");

const signup = catchAsync(async (req, res, next) => {
    return res.json({
        message: "hi from our api",
    });
});

module.exports = {
    signup,
};
