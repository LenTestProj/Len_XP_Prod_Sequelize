const express = require("express");

const router = express.Router();

const PackagingMaterialController = require("../controllers/packagingMaterialDetails.controller");

const Authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createPackagingMaterialValidation,
    updatePackagingMaterialValidation,
} = require("../validations/packagingMaterialDetails.validation");

/*
|--------------------------------------------------------------------------
| Packaging Material Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Packaging Material
 * POST /api/packaging-materials
 */
router.post(
    "/",
    Authenticate,
    createPackagingMaterialValidation,
    validate,
    PackagingMaterialController.create
);

/**
 * Get All Packaging Materials
 * GET /api/packaging-materials?page=1&limit=10&search=
 */
router.get(
    "/",
    Authenticate,
    PackagingMaterialController.list
);

/**
 * Get Packaging Material By Item Id
 * GET /api/packaging-materials/:itemId
 */
router.get(
    "/:itemId",
    Authenticate,
    PackagingMaterialController.getById
);

/**
 * Update Packaging Material
 * PUT /api/packaging-materials/:itemId
 */
router.put(
    "/:itemId",
    Authenticate,
    updatePackagingMaterialValidation,
    validate,
    PackagingMaterialController.update
);

/**
 * Delete Packaging Material
 * DELETE /api/packaging-materials/:itemId
 */
router.delete(
    "/:itemId",
    Authenticate,
    PackagingMaterialController.delete
);

module.exports = router;