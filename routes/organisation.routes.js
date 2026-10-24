const express = require("express");

const router = express.Router();

const OrganisationController = require("../controllers/organisation.controller");

const Authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createOrganisationValidation,
    updateOrganisationValidation,
} = require("../validations/organisation.validation");

/*
|--------------------------------------------------------------------------
| Organisation Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Organisation
 * POST /api/organisations
 */
router.post(
    "/",
    Authenticate,
    createOrganisationValidation,
    validate,
    OrganisationController.create
);

/**
 * Get Organisation List
 * GET /api/organisations
 */
router.get(
    "/",
    Authenticate,
    OrganisationController.list
);

/**
 * Get Organisation By Id
 * GET /api/organisations/:id
 */
router.get(
    "/:id",
    Authenticate,
    OrganisationController.getById
);

/**
 * Update Organisation
 * PUT /api/organisations/:id
 */
router.put(
    "/:id",
    Authenticate,
    updateOrganisationValidation,
    validate,
    OrganisationController.update
);

/**
 * Delete Organisation
 * DELETE /api/organisations/:id
 */
router.delete(
    "/:id",
    Authenticate,
    OrganisationController.delete
);

module.exports = router;