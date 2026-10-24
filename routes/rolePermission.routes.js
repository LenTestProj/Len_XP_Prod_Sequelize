const express = require("express");

const router = express.Router();

const RolePermissionController = require("../controllers/rolePermission.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/permission.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    assignPermissionsValidation,
} = require("../validations/rolePermission.validation");

/**
 * Assign Permissions To Role
 *
 * PUT /api/roles/:id/permissions
 */
router.put(
    "/:id/permissions",
    authMiddleware,
    authorize("role.permission.assign"),
    assignPermissionsValidation,
    validate,
    RolePermissionController.assign
);

module.exports = router;