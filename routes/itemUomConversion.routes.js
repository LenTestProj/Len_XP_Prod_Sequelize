const express = require("express");
const router = express.Router();

const ItemUomConversionController = require("../controllers/itemUomConversion.controller");

const {
    createValidation,
    updateValidation,
} = require("../validations/itemUomConversion.validation");

const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");

/*
|--------------------------------------------------------------------------
| Item UOM Conversion Routes
|--------------------------------------------------------------------------
*/

// Create
router.post(
    "/",
    auth,
    createValidation,
    validate,
    ItemUomConversionController.create
);

// Get All
router.get(
    "/",
    auth,
    ItemUomConversionController.list
);

// Get By Id
router.get(
    "/:id",
    auth,
    ItemUomConversionController.getById
);

// Update
router.put(
    "/:id",
    auth,
    updateValidation,
    validate,
    ItemUomConversionController.update
);

// Delete
router.delete(
    "/:id",
    auth,
    ItemUomConversionController.delete
);

module.exports = router;