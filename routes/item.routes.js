const express = require("express");

const router = express.Router();

const ItemController = require("../controllers/item.controller");

const Authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createItemValidation,
    updateItemValidation,
} = require("../validations/item.validation");

/*
|--------------------------------------------------------------------------
| Item Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Item
 * POST /api/items
 */
router.post(
    "/",
    Authenticate,
    createItemValidation,
    validate,
    ItemController.create
);

/**
 * Get All Items
 * GET /api/items?page=1&limit=10&search=sugar&organisation_id=1&item_type=RAW_MATERIAL
 */
router.get(
    "/",
    Authenticate,
    ItemController.list
);

/**
 * Get Item By Id
 * GET /api/items/:id
 */
router.get(
    "/:id",
    Authenticate,
    ItemController.getById
);

/**
 * Update Item
 * PUT /api/items/:id
 */
router.put(
    "/:id",
    Authenticate,
    updateItemValidation,
    validate,
    ItemController.update
);

/**
 * Delete Item (Soft Delete)
 * DELETE /api/items/:id
 */
router.delete(
    "/:id",
    Authenticate,
    ItemController.delete
);

module.exports = router;