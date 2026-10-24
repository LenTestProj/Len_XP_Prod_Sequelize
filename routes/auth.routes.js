const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const Authenticate = require("../middlewares/auth.middleware");

const {
    signupValidation,
    loginValidation,
    forgotPasswordValidation,
    verifyOtpValidation,
    resetPasswordValidation,
    changePasswordValidation,
} = require("../validations/auth.validation");
const validate = require("../middlewares/validate.middleware");

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

// router.post(
//     "/signup",
//     signupValidation,
//     validate,
//     AuthController.signup
// );

router.post(
    "/login",
    loginValidation,
    validate,
    AuthController.login
);
router.post(
    "/change-password",
    Authenticate,
    changePasswordValidation,
    validate,
    AuthController.changePassword
);
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validate,
    AuthController.forgotPassword
);

router.post(
    "/verify-otp",
    verifyOtpValidation,
    validate,
    AuthController.verifyOtp
);

router.post(
    "/reset-password",
    resetPasswordValidation,
    validate,
    AuthController.resetPassword
);

module.exports = router;