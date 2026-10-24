const express = require("express");

const router = express.Router();

const WarehouseController = require("../controllers/warehouse.controller");

const authenticate = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createWarehouseValidation,
    updateWarehouseValidation,
} = require("../validations/warehouse.validation");


/*
|--------------------------------------------------------------------------
| Warehouse + Location CRUD
|--------------------------------------------------------------------------
*/


/**
 * Create Warehouse + Locations
 * POST /warehouses
 */
router.post(
    "/",
    authenticate,
    createWarehouseValidation,
    validate,
    WarehouseController.create
);


/**
 * Get All Warehouses + Locations
 * GET /warehouses
 */
router.get(
    "/",
    authenticate,
    WarehouseController.list
);


/**
 * Get Warehouse + Locations By ID
 * GET /warehouses/:id
 */
router.get(
    "/:id",
    authenticate,
    WarehouseController.getById
);


/**
 * Update Warehouse + Locations
 * PUT /warehouses/:id
 */
router.put(
    "/:id",
    authenticate,
    updateWarehouseValidation,
    validate,
    WarehouseController.update
);


/**
 * Delete Warehouse + All Locations
 * DELETE /warehouses/:id
 */
router.delete(
    "/:id",
    authenticate,
    WarehouseController.delete
);


module.exports = router;