const {
    createRawMaterial,
    findByItemId,
    exists,
    updateRawMaterial,
    deleteRawMaterial,
    listRawMaterials,
} = require("../services/rawmaterialDetails.service");

const { Items } = require("../models");

class RawMaterialController {

    /**
     * Create Raw Material Details
     * POST /api/raw-materials
     */
    static async create(req, res) {

        try {

            const {
                item_id,
                material_category,
                ingredient_name,
                allergen_information,
                requires_quality_check,
                storage_temperature_min,
                storage_temperature_max,
                density_kg_per_litre,
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
            | Item Type Validation
            |--------------------------------------------------------------------------
            */

            if (item.item_type !== "RAW_MATERIAL") {

                return res.status(400).json({
                    success: false,
                    message: "Selected item is not a Raw Material.",
                });

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
                    message: "Raw material details already exist.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            const rawMaterial = await createRawMaterial({

                item_id,

                material_category,

                ingredient_name,

                allergen_information,

                requires_quality_check,

                storage_temperature_min,

                storage_temperature_max,

                density_kg_per_litre,

            });

            return res.status(201).json({

                success: true,

                message: "Raw material created successfully.",

                data: rawMaterial,

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
     * Get All Raw Materials
     */
    static async list(req, res) {

        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await listRawMaterials({

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
     * Get Raw Material By Item Id
     */
    static async getById(req, res) {

        try {

            const rawMaterial = await findByItemId(req.params.itemId);

            if (!rawMaterial) {

                return res.status(404).json({

                    success: false,

                    message: "Raw material not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: rawMaterial,

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Update Raw Material
     */
    static async update(req, res) {

        try {

            const rawMaterial = await findByItemId(req.params.itemId);

            if (!rawMaterial) {

                return res.status(404).json({

                    success: false,

                    message: "Raw material not found.",

                });

            }

            await updateRawMaterial(

                req.params.itemId,

                req.body

            );

            return res.status(200).json({

                success: true,
                data:rawMaterial,
                message: "Raw material updated successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Delete Raw Material
     */
    static async delete(req, res) {

        try {

            const rawMaterial = await findByItemId(req.params.itemId);

            if (!rawMaterial) {

                return res.status(404).json({

                    success: false,

                    message: "Raw material not found.",

                });

            }

            await deleteRawMaterial(req.params.itemId);

            return res.status(200).json({

                success: true,

                message: "Raw material deleted successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = RawMaterialController;