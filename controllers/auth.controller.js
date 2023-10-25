const { catchAsync } = require("../util/catch-async");
const authService = require("../services/auth.service");

const signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    await authService.signUp(name, email, password);

    return res.status(200).json({
        status: "success",
        message: `Check the confirmation otp code at ${email}`,
    });
});

module.exports = {
    signup,
};
