const joi = require('joi');
const { catchAsync, AppError } = require('../util');

//construct schema for each request body
//signUp schema
const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
  name: joi.string().min(3).max(30).required(),
});
// verifyEmail schema
const verifyEmailSchema = joi.object({
  otp: joi.string().max(6).min(6).required(),
});
// login-schema
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});
//createNote schema
const createNoteSchema = joi.object({
  body: joi.string().required(),
  title: joi.string().required(),
});

const AllSchemas = {
  signup: signupSchema,
  'verify-email': verifyEmailSchema,
  login: loginSchema,
  createNote: createNoteSchema,
};
const availableSchemas = ['signup', 'login', 'verify-email'];

async function validate(schema, req) {
  return await schema.validate(req.body, { abortEarly: false });
}
const ValidateMiddleware = async (req, res, next) => {
  const endPoint = req.path.split('/').pop();

  if (availableSchemas.includes(endPoint)) {
    const { error, _ } = await validate(AllSchemas[endPoint], req);
    if (error) {
      const errorMessage = error.message.replace(/"/g, '').replace('.', ' and');
      return next(new AppError(errorMessage, 400));
    } else next();
  } else if (req.path == '/') {
    if (req.method == 'POST') {
      const { error, _ } = await validate(AllSchemas.createNote, req);

      if (error) {
        const errorMessage = error.message
          .replace(/"/g, '')
          .replace('.', ' and');
        return next(new AppError(errorMessage, 400));
      } else next();
    } else next();
  } else next();
};
module.exports = ValidateMiddleware;
