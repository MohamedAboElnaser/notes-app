const jwt = require("jsonwebtoken");
const  AppError  = require("./AppError");

/**
 * @class JWTService
 * @classdesc A service for generating and decoding JWT (JSON Web Token) tokens.
 */
class JWTService {
    /**
     * Generates a JWT token with the provided user id.
     * @param {string} id - The id of the user to be included in the JWT payload.
     * @returns {Promise<string>} A promise that resolves to the generated JWT token.
     */
    static async generate(id) {
        const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_IN,
        });

        return jwtToken;
    }

    /**
     * Decodes a JWT token.
     * @param {string} token - The JWT token to be decoded.
     * @returns {Promise<Object>} A promise that resolves to the decoded payload if the token is valid.
     */
    static async decode(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken;
        } catch (err) {
            throw new AppError(
                "Unauthorized, Please Login again to get access",
                401
            );
        }
    }
}

module.exports =  JWTService;
