const express = require("express");

const router =
    express.Router();

const PurchaseReceiptController =
    require("../controllers/purchaseReceipt.controller");

const {
    createPurchaseReceiptValidation,
} =
    require("../validations/purchaseReceipt.validation");

const validate = require("../middlewares/validate.middleware");

router.post(
    "/",
    createPurchaseReceiptValidation,
    validate,
    PurchaseReceiptController.create
);


router.get(
    "/",
    PurchaseReceiptController.list
);


router.get(
    "/:id",
    PurchaseReceiptController.getById
);


router.patch(
    "/:id/status",
    PurchaseReceiptController.updateStatus
);


module.exports = router;