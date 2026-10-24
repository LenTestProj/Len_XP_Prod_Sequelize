const express = require("express");

const router =
    express.Router();

const VendorController =
    require("../controllers/vendor.controller");

const {

    createVendorValidation,
    updateVendorValidation,
    createVendorItemValidation,
    createVendorItemPriceValidation,

} = require("../validations/vendor.validation");

const validate = require("../middlewares/validate.middleware");


router.post(
    "/",
    createVendorValidation,
    validate,
    VendorController.create
);


router.get(
    "/",
    VendorController.list
);


router.get(
    "/:id",
    VendorController.getById
);


router.put(
    "/:id",
    updateVendorValidation,
    validate,
    VendorController.update
);


router.delete(
    "/:id",
    VendorController.delete
);


module.exports = router;