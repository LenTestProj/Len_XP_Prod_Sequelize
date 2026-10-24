const express = require("express");

const router = express.Router();

const VendorItemController =
    require("../controllers/vendorItem.controller");

const {
    createVendorItemValidation,
    updateVendorItemValidation,
} = require("../validations/vendorItem.validation");

const validate = require("../middlewares/validate.middleware");


/**
 * Vendor Item + Price History
 */

/**
 * Create Vendor Item + Prices
 */
router.post(
    "/",
    createVendorItemValidation,
    validate,
    VendorItemController.create
);


/**
 * Get Vendor Items
 */
router.get(
    "/vendors/:vendorId/items",
    VendorItemController.list
);


/**
 * Get Single Vendor Item + Prices
 */
router.get(
    "/:id",
    VendorItemController.getById
);


/**
 * Update Vendor Item + Prices
 */
router.put(
    "/:id",
    updateVendorItemValidation,
    validate,
    VendorItemController.update
);


/**
 * Deactivate Vendor Item
 */
router.delete(
    "/:id",
    VendorItemController.delete
);


module.exports = router;