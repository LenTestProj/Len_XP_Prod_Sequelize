const express = require("express");

const router = express.Router();

const UnitController = require("../controllers/unit.controller");

const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createUnitValidation,
    updateUnitValidation,
} = require("../validations/unit.validation");

/*
|--------------------------------------------------------------------------
| Unit Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    createUnitValidation,
    validate,
    UnitController.create
);

router.get(
    "/",
    authenticate,
    UnitController.list
);

router.get(
    "/:id",
    authenticate,
    UnitController.getById
);

router.put(
    "/:id",
    authenticate,
    updateUnitValidation,
    validate,
    UnitController.update
);

router.delete(
    "/:id",
    authenticate,
    UnitController.delete
);

module.exports = router;