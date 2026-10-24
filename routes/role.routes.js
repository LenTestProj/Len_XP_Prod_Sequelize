const express = require("express");

const router = express.Router();

const RoleController = require("../controllers/role.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/permission.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createRoleValidation,
    updateRoleValidation,
    updateStatusValidation,
    roleIdValidation,
} = require("../validations/role.validation");

/**
 * Create Role
 */
router.post(
    "/",
    authMiddleware,
    authorize("role.create"),
    createRoleValidation,
    validate,
    RoleController.create
);

/**
 * List Roles
 */
router.get(
    "/",
    authMiddleware,
    authorize("role.view"),
    RoleController.list
);

/**
 * Get Role By Id
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("role.view"),
    roleIdValidation,
    validate,
    RoleController.getById
);

/**
 * Update Role
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("role.update"),
    updateRoleValidation,
    validate,
    RoleController.update
);

/**
 * Update Status
 */
// router.patch(
//     "/:id/status",
//     authMiddleware,
//     authorize("role.update"),
//     updateStatusValidation,
//     validate,
//     RoleController.updateStatus
// );

/**
 * Delete Role
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("role.delete"),
    roleIdValidation,
    validate,
    RoleController.delete
);

module.exports = router;