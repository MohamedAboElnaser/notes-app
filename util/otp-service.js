const crypto = require("crypto");

class OTPService {
    /**
     * Generate a random OTP of given length.
     * @param {number} otpLength - Length of OTP to be generated.
     * @returns {number} - Generated OTP.
     */
    static generate(length) {
        if (length <= 0) {
            return 0;
        }

        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Hash the OTP using SHA256.
     * @param {string} otp - OTP to be hashed.
     * @returns {string} - Hashed OTP.
     */
    static hash(otp) {
        const hashedOTP = crypto
            .createHash("sha256")
            .update(String(otp))
            .digest("hex");

        return hashedOTP;
    }

    /**
     * Verify the OTP.
     * @param {string} otp - OTP to be verified.
     * @param {string} hashedOTP - Hashed OTP to be verified.
     * @returns {boolean} - True if OTP is verified, false otherwise.
     */
    static verify(otp, hashedOTP) {
        const isVerified = hashedOTP === OTPService.hash(otp);

        return isVerified;
    }
}

module.exports = OTPService;
