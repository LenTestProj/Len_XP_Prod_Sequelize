const {
    createFinishedProduct,
    findByItemId,
    exists,
    updateFinishedProduct,
    deleteFinishedProduct,
    listFinishedProducts,
} = require("../services/finishedProduct.service");

const {
    Items,
    Units,
} = require("../models");

class FinishedProductController {

    /**
     * Create Finished Product Details
     * POST /api/finished-products
     */
    static async create(req, res) {

        try {

            const {
                item_id,
                product_category,
                net_content_value,
                net_content_uom_id,
                default_batch_output_qty,
                sale_pack_size,
                quality_check_required,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Check Item
            |--------------------------------------------------------------------------
            */

            const item = await Items.findByPk(item_id);

            if (!item) {

                return res.status(404).json({
                    success: false,
                    message: "Item not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Validate Item Type
            |--------------------------------------------------------------------------
            */

            if (item.item_type !== "FINISHED_PRODUCT") {

                return res.status(400).json({
                    success: false,
                    message: "Selected item is not a Finished Product.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Validate Net Content UOM
            |--------------------------------------------------------------------------
            */

            if (net_content_uom_id) {

                const uom = await Units.findByPk(net_content_uom_id);

                if (!uom) {

                    return res.status(404).json({
                        success: false,
                        message: "Net Content UOM not found.",
                    });

                }

            }

            /*
            |--------------------------------------------------------------------------
            | Already Exists
            |--------------------------------------------------------------------------
            */

            const alreadyExists = await exists(item_id);

            if (alreadyExists) {

                return res.status(409).json({
                    success: false,
                    message: "Finished product details already exist.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            const finishedProduct = await createFinishedProduct({

                item_id,

                product_category,

                net_content_value,

                net_content_uom_id,

                default_batch_output_qty,

                sale_pack_size,

                quality_check_required,

            });

            return res.status(201).json({

                success: true,

                message: "Finished product created successfully.",

                data: finishedProduct,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Get All Finished Products
     */
    static async list(req, res) {

        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await listFinishedProducts({

                page,

                limit,

                search: req.query.search,

            });

            return res.status(200).json({

                success: true,

                totalRecords: result.count,

                totalPages: Math.ceil(result.count / limit),

                currentPage: page,

                data: result.rows,

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Get Finished Product By Item Id
     */
    static async getById(req, res) {

        try {

            const finishedProduct = await findByItemId(req.params.itemId);

            if (!finishedProduct) {

                return res.status(404).json({

                    success: false,

                    message: "Finished product not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: finishedProduct,

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Update Finished Product
     */
    static async update(req, res) {

        try {

            const finishedProduct = await findByItemId(req.params.itemId);

            if (!finishedProduct) {

                return res.status(404).json({

                    success: false,

                    message: "Finished product not found.",

                });

            }

            /*
            |--------------------------------------------------------------------------
            | Validate Net Content UOM
            |--------------------------------------------------------------------------
            */

            if (req.body.net_content_uom_id) {

                const uom = await Units.findByPk(
                    req.body.net_content_uom_id
                );

                if (!uom) {

                    return res.status(404).json({

                        success: false,

                        message: "Net Content UOM not found.",

                    });

                }

            }

            await updateFinishedProduct(

                req.params.itemId,

                req.body

            );

            return res.status(200).json({

                success: true,

                message: "Finished product updated successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Delete Finished Product
     */
    static async delete(req, res) {

        try {

            const finishedProduct = await findByItemId(req.params.itemId);

            if (!finishedProduct) {

                return res.status(404).json({

                    success: false,

                    message: "Finished product not found.",

                });

            }

            await deleteFinishedProduct(req.params.itemId);

            return res.status(200).json({

                success: true,

                message: "Finished product deleted successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = FinishedProductController;