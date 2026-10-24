const express = require("express");

const router = express.Router();

const TaxController = require("../controllers/tax.controller");

const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createTaxValidation,
    updateTaxValidation,
} = require("../validations/tax.validation");

/*
|--------------------------------------------------------------------------
| Tax Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    createTaxValidation,
    validate,
    TaxController.create
);

router.get(
    "/",
    authenticate,
    TaxController.list
);

router.get(
    "/:id",
    authenticate,
    TaxController.getById
);

router.put(
    "/:id",
    authenticate,
    updateTaxValidation,
    validate,
    TaxController.update
);

router.delete(
    "/:id",
    authenticate,
    TaxController.delete
);

module.exports = router;