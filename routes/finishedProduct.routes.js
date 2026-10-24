const express = require("express");

const router = express.Router();

const FinishedProductController = require("../controllers/finishedProduct.controller");

const Authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createFinishedProductValidation,
    updateFinishedProductValidation,
} = require("../validations/finishedProduct.validation");

/*
|--------------------------------------------------------------------------
| Finished Product Details Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    Authenticate,
    createFinishedProductValidation,
    validate,
    FinishedProductController.create
);

router.get(
    "/",
    Authenticate,
    FinishedProductController.list
);

router.get(
    "/:itemId",
    Authenticate,
    FinishedProductController.getById
);

router.put(
    "/:itemId",
    Authenticate,
    updateFinishedProductValidation,
    validate,
    FinishedProductController.update
);

router.delete(
    "/:itemId",
    Authenticate,
    FinishedProductController.delete
);

module.exports = router;