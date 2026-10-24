const {
    createConversion,
    findById,
    findDuplicate,
    updateConversion,
    deleteConversion,
    listConversions,
} = require("../services/itemUomConversion.service");

const {
    Items,
    Units,
} = require("../models");

class ItemUomConversionController {

    /**
     * Create Conversion
     * POST /api/item-uom-conversions
     */
    static async create(req, res) {

        try {

            const {
                item_id,
                from_uom_id,
                to_uom_id,
                conversion_factor,
                is_purchase_conversion,
                is_production_conversion,
                effective_from,
                effective_to,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Validate Item
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
            | Validate From UOM
            |--------------------------------------------------------------------------
            */

            const fromUom = await Units.findByPk(from_uom_id);

            if (!fromUom) {

                return res.status(404).json({
                    success: false,
                    message: "From UOM not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Validate To UOM
            |--------------------------------------------------------------------------
            */

            const toUom = await Units.findByPk(to_uom_id);

            if (!toUom) {

                return res.status(404).json({
                    success: false,
                    message: "To UOM not found.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | From & To UOM Should Be Different
            |--------------------------------------------------------------------------
            */

            if (from_uom_id === to_uom_id) {

                return res.status(400).json({
                    success: false,
                    message: "From UOM and To UOM cannot be the same.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Effective Date Validation
            |--------------------------------------------------------------------------
            */

            if (
                effective_from &&
                effective_to &&
                new Date(effective_from) > new Date(effective_to)
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Effective From cannot be greater than Effective To.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Duplicate Check
            |--------------------------------------------------------------------------
            */

            const duplicate = await findDuplicate(
                item_id,
                from_uom_id,
                to_uom_id,
                effective_from
            );

            if (duplicate) {

                return res.status(409).json({
                    success: false,
                    message: "Conversion already exists.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            const conversion = await createConversion({

                item_id,

                from_uom_id,

                to_uom_id,

                conversion_factor,

                is_purchase_conversion,

                is_production_conversion,

                effective_from,

                effective_to,

            });

            return res.status(201).json({

                success: true,

                message: "Item UOM Conversion created successfully.",

                data: conversion,

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
     * Get All Conversions
     */
    static async list(req, res) {

        try {

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 10;

            const result = await listConversions({

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
     * Get By Id
     */
    static async getById(req, res) {

        try {

            const conversion = await findById(req.params.id);

            if (!conversion) {

                return res.status(404).json({

                    success: false,

                    message: "Conversion not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: conversion,

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Update Conversion
     */
    static async update(req, res) {

        try {

            const conversion = await findById(req.params.id);

            if (!conversion) {

                return res.status(404).json({

                    success: false,

                    message: "Conversion not found.",

                });

            }

            const {
                item_id,
                from_uom_id,
                to_uom_id,
                effective_from,
                effective_to,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Validate Item
            |--------------------------------------------------------------------------
            */

            if (item_id) {

                const item = await Items.findByPk(item_id);

                if (!item) {

                    return res.status(404).json({

                        success: false,

                        message: "Item not found.",

                    });

                }

            }

            /*
            |--------------------------------------------------------------------------
            | Validate UOMs
            |--------------------------------------------------------------------------
            */

            if (from_uom_id) {

                const from = await Units.findByPk(from_uom_id);

                if (!from) {

                    return res.status(404).json({

                        success: false,

                        message: "From UOM not found.",

                    });

                }

            }

            if (to_uom_id) {

                const to = await Units.findByPk(to_uom_id);

                if (!to) {

                    return res.status(404).json({

                        success: false,

                        message: "To UOM not found.",

                    });

                }

            }

            if (
                from_uom_id &&
                to_uom_id &&
                from_uom_id === to_uom_id
            ) {

                return res.status(400).json({

                    success: false,

                    message: "From UOM and To UOM cannot be the same.",

                });

            }

            if (
                effective_from &&
                effective_to &&
                new Date(effective_from) > new Date(effective_to)
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Effective From cannot be greater than Effective To.",

                });

            }

            const duplicate = await findDuplicate(

                item_id || conversion.item_id,

                from_uom_id || conversion.from_uom_id,

                to_uom_id || conversion.to_uom_id,

                effective_from || conversion.effective_from,

                conversion.id

            );

            if (duplicate) {

                return res.status(409).json({

                    success: false,

                    message: "Conversion already exists.",

                });

            }

            await updateConversion(
                conversion.id,
                req.body
            );

            return res.status(200).json({

                success: true,

                message: "Conversion updated successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Delete Conversion
     */
    static async delete(req, res) {

        try {

            const conversion = await findById(req.params.id);

            if (!conversion) {

                return res.status(404).json({

                    success: false,

                    message: "Conversion not found.",

                });

            }

            await deleteConversion(conversion.id);

            return res.status(200).json({

                success: true,

                message: "Conversion deleted successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = ItemUomConversionController;