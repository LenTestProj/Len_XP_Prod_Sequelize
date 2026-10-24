const express = require("express");

const router = express.Router();

const PermissionController = require("../controllers/permission.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/permission.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createPermissionValidation,
    updatePermissionValidation,
    permissionIdValidation,
} = require("../validations/permission.validation");

/**
 * Create Permission
 */
router.post(
    "/",
    authMiddleware,
    authorize("permission.create"),
    createPermissionValidation,
    validate,
    PermissionController.create
);

/**
 * Permission List
 */
router.get(
    "/",
    authMiddleware,
    authorize("permission.view"),
    PermissionController.list
);

/**
 * Permission Details
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("permission.view"),
    permissionIdValidation,
    validate,
    PermissionController.getById
);

/**
 * Update Permission
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("permission.update"),
    updatePermissionValidation,
    validate,
    PermissionController.update
);

/**
 * Delete Permission
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("permission.delete"),
    permissionIdValidation,
    validate,
    PermissionController.delete
);

module.exports = router;