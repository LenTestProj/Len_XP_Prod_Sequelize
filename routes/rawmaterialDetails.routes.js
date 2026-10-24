const express = require("express");

const router = express.Router();

const RawMaterialController = require("../controllers/rawmaterialDetails.controller");

const Authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createRawMaterialValidation,
    updateRawMaterialValidation,
} = require("../validations/rawmaterialDetails.validation");

/*
|--------------------------------------------------------------------------
| Raw Material Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Raw Material Details
 * POST /api/raw-materials
 */
router.post(
    "/",
    Authenticate,
    createRawMaterialValidation,
    validate,
    RawMaterialController.create
);

/**
 * Get All Raw Materials
 * GET /api/raw-materials?page=1&limit=10&search=sugar
 */
router.get(
    "/",
    Authenticate,
    RawMaterialController.list
);

/**
 * Get Raw Material By Item Id
 * GET /api/raw-materials/:itemId
 */
router.get(
    "/:itemId",
    Authenticate,
    RawMaterialController.getById
);

/**
 * Update Raw Material
 * PUT /api/raw-materials/:itemId
 */
router.put(
    "/:itemId",
    Authenticate,
    updateRawMaterialValidation,
    validate,
    RawMaterialController.update
);

/**
 * Delete Raw Material
 * DELETE /api/raw-materials/:itemId
 */
router.delete(
    "/:itemId",
    Authenticate,
    RawMaterialController.delete
);

module.exports = router;