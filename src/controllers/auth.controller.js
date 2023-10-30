const { catchAsync } = require("../util");
const authService = require("../services/auth.service");

const signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    await authService.signUp(name, email, password);

    return res.status(200).json({
        status: "success",
        message: `Check the confirmation otp code at ${email}`,
    });
});

const verifyEmail = catchAsync(async (req, res) => {
    const { otp } = req.body;
    await authService.verifyEmail(otp);

    return res.status(200).json({
        status: "success",
        message: "Your email verified successfully, you can login now.",
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    return res.status(200).json({
        status: "success",
        message: "user log in successfully",
        token,
    });
});
module.exports = {
    signup,
    verifyEmail,
    login,
};
