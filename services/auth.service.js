const bcrypt = require("bcrypt");
const { AppError, OTPService } = require("../util");
const { db } = require("../config");

const signUp = async (name, email, password) => {
    /**
     * validate that field exists
     * check if that email is already register or not if it register throw error
     * hash the password to save to db
     * create user record at db
     * generate otp
     * create verification record contains otp and userId
     */
    if (!name || !email || !password)
        throw new AppError("Missing required fields.", 500);
    //check if the email already used
    const user = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (user)
        throw new AppError(
            "This email is already used by another user. Try another one.",
            400
        );
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUserRecord = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        if (!newUserRecord)
            throw new AppError(
                "Error happen while creating the user account,please try again",
                500
            );

        //generate otp
        const otp = OTPService.generate(6);
        const hashedOtp = OTPService.hash(otp);

        //create verification record at the db
        const verificationRecord = await db.verification.create({
            data: {
                otp: hashedOtp,
                userId: newUserRecord.userId,
            },
        });

        if (!verificationRecord)
            throw new AppError(
                "Error happen while creating otp record, please try again",
                500
            );

        //send otp to user via email
        //TODO i will use events to send email by implement this in subscribers directory
        // now i just log the otp to verify the account
        console.log("The generated otp is: ", otp);
    } catch (err) {
        //Rollback
        /**
         * Remove the user record from the db
         * Remove the verification record from the db
         * Throw the error to be handel in the controller
         */
        await db.user.delete({
            where: {
                email,
            },
        });
        await db.verification.delete({
            where: {
                otp: hashedOtp,
            },
        });
        throw err;
    }
};


module.exports = {
    signUp,
};
