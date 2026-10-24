const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/permission.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createUserValidation,
    updateUserValidation,
    updateStatusValidation,
    userIdValidation,
} = require("../validations/user.validation");

/*
|--------------------------------------------------------------------------
| Create Admin User
|--------------------------------------------------------------------------
*/
router.post(
    "/",
    authMiddleware,
    authorize("user.create"),
    createUserValidation,
    validate,
    userController.create
);

/*
|--------------------------------------------------------------------------
| Get Admin Users
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    authMiddleware,
    authorize("user.view"),
    userController.list
);

/*
|--------------------------------------------------------------------------
| Get Admin User Details
|--------------------------------------------------------------------------
*/
router.get(
    "/:id",
    authMiddleware,
    authorize("user.view"),
    userIdValidation,
    validate,
    userController.getById
);

/*
|--------------------------------------------------------------------------
| Update Admin User
|--------------------------------------------------------------------------
*/
router.put(
    "/:id",
    authMiddleware,
    authorize("user.update"),
    updateUserValidation,
    validate,
    userController.update
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/
// router.patch(
//     "/:id/status",
//     authMiddleware,
//     authorize("user.update"),
//     updateStatusValidation,
//     validate,
//     userController.updateStatus
// );

/*
|--------------------------------------------------------------------------
| Delete Admin User
|--------------------------------------------------------------------------
*/
router.delete(
    "/:id",
    authMiddleware,
    authorize("user.delete"),
    userIdValidation,
    validate,
    userController.delete
);

module.exports = router;