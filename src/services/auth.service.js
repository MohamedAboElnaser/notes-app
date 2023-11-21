const bcrypt = require('bcrypt');
const { AppError, OTPService, JWTService, Email } = require('../util');
const { db } = require('../../config');

const signUp = async (name, email, password) => {
  /**
   * validate that field existence
   * check if that email is already register or not if it register throw error
   * hash the password to save to db
   * create user record at db
   * generate otp
   * create verification record contains otp and userId
   */
  let hashedOtp;
  let missingFields = `${!name ? 'name' : ''} ${!email ? 'email' : ''} ${
    !password ? 'password' : ''
  }`;
  if (!name || !email || !password)
    throw new AppError(`Missing fields: ${missingFields}`, 400);
  //check if the email already used
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (user)
    throw new AppError(
      'This email is already used by another user. Try another one.',
      400,
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
        'Error happen while creating the user account,please try again',
        500,
      );

    //generate otp of 6 digits
    const otp = OTPService.generate(6);
    hashedOtp = OTPService.hash(otp);

    //create verification record at the db
    const verificationRecord = await db.verification.create({
      data: {
        otp: hashedOtp,
        userId: newUserRecord.userId,
      },
    });

    if (!verificationRecord)
      throw new AppError(
        'Error happen while creating otp record, please try again',
        500,
      );

    //send otp to user via email
    await new Email(
      email,
      'Verify email address',
      `Thanks for register to our app your otp code is : ${otp}`,
    ).send();
    return otp;
  } catch (err) {
    //Rollback
    /**
     * Remove the user record from the db
     * Remove the verification record from the db
     * Throw the error to be  in the controller
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

const verifyEmail = async (otp) => {
  /**
   * validate otp existence
   * Fetch  verification record using hashedOtp
   * Throw an error if there is no record
   * Verify the user record using userId returned from verification Record
   * delete verification record
   */

  //validate fields this because JavaScript is a loosely typed language
  if (!otp) throw new AppError('Missed field: otp', 400);

  const hashedOtp = OTPService.hash(otp);
  try {
    //Fetch otp record from verification table
    const verificationRecord = await db.verification.findUnique({
      where: {
        otp: hashedOtp,
      },
    });

    if (!verificationRecord)
      throw new AppError('Invalid OTP , Please try again', 404);

    //verify the user record
    const user = await db.user.update({
      where: {
        userId: verificationRecord.userId,
      },
      data: {
        isActive: true,
      },
    });

    if (!user)
      throw new AppError(
        "Error happen while verifying  user's email ,please try again",
        500,
      );
    //delete otp record related to the user
    await db.verification.delete({
      where: {
        otp: hashedOtp,
      },
    });
  } catch (err) {
    throw err;
  }
};

const login = async (email, password) => {
  /**
   * Validate the existence of fields
   * Fetch user record using email
   * Throw error if not exist
   * Make sure that the user's mail is activated else throw error
   * validate the password and throw error if there an error
   * generate jwt with id [uuid] as the payload
   * return return jwt
   */

  if (!email || !password)
    throw new AppError(
      `Missing fields : ${password ? 'email' : 'password'}`,
      400,
    );
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        isActive: true,
        password: true,
      },
    });

    if (!user)
      throw new AppError('This email is not attached to any user.', 404);

    if (!user.isActive)
      throw new AppError('You should activate your mail first.', 400);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid Password', 401);

    const jwt = await JWTService.generate(user.id);
    return jwt;
  } catch (err) {
    throw err;
  }
};

const reverifyEmail = async (email) => {
  if (!email) throw new AppError('Missing require field', 500);
  //fetch user record using email
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new AppError('This email is not registered:(', 404);
  if (user.isActive) throw new AppError('This email is already verified', 400);

  //remove any verification records related to this user
  await db.verification.deleteMany({
    where: {
      userId: user.userId,
    },
  });
  //generate new otp of 6 digits
  const otp = OTPService.generate(6);
  hashedOtp = OTPService.hash(otp);

  //create verification record at the db
  const verificationRecord = await db.verification.create({
    data: {
      otp: hashedOtp,
      userId: user.userId,
    },
  });

  if (!verificationRecord)
    throw new AppError(
      'Error happen while creating otp record, please try again',
      500,
    );

  //resend otp to user via email
  await new Email(
    email,
    'Resend otp verification code',
    `Your otp code is : ${otp}`,
  ).send();
  return otp;
};
module.exports = {
  signUp,
  verifyEmail,
  login,
  reverifyEmail,
};
