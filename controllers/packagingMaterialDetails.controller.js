const {
    createPackagingMaterial,
    findByItemId,
    exists,
    updatePackagingMaterial,
    deletePackagingMaterial,
    listPackagingMaterials,
} = require("../services/packagingMaterialDetails.service");

const {
    Items,
    Units,
} = require("../models");

class PackagingMaterialController {

    /**
     * Create Packaging Material
     * POST /api/packaging-materials
     */
    static async create(req, res) {

        try {

            const {
                item_id,
                packaging_level,
                packaging_type,
                capacity_value,
                capacity_uom_id,
                units_per_pack,
                reusable,
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

            if (item.item_type !== "PACKAGING_MATERIAL") {

                return res.status(400).json({
                    success: false,
                    message: "Selected item is not a Packaging Material.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Capacity UOM Validation
            |--------------------------------------------------------------------------
            */

            if (capacity_uom_id) {

                const uom = await Units.findByPk(
                    capacity_uom_id
                );

                if (!uom) {

                    return res.status(404).json({
                        success: false,
                        message: "Capacity UOM not found.",
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
                    message: "Packaging material details already exist.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            const packagingMaterial =
                await createPackagingMaterial({

                    item_id,

                    packaging_level,

                    packaging_type,

                    capacity_value,

                    capacity_uom_id,

                    units_per_pack,

                    reusable,

                });

            return res.status(201).json({

                success: true,

                message: "Packaging material created successfully.",

                data: packagingMaterial,

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
     * Get All Packaging Materials
     */
    static async list(req, res) {

        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await listPackagingMaterials({

                page,

                limit,

                search: req.query.search,

            });

            return res.status(200).json({

                success: true,

                totalRecords: result.count,

                totalPages: Math.ceil(
                    result.count / limit
                ),

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
     * Get Packaging Material By Item Id
     */
    static async getById(req, res) {

        try {

            const material = await findByItemId(
                req.params.itemId
            );

            if (!material) {

                return res.status(404).json({

                    success: false,

                    message: "Packaging material not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: material,

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Update Packaging Material
     */
    static async update(req, res) {

        try {

            const material = await findByItemId(
                req.params.itemId
            );

            if (!material) {

                return res.status(404).json({

                    success: false,

                    message: "Packaging material not found.",

                });

            }

            /*
            |--------------------------------------------------------------------------
            | Validate Capacity UOM
            |--------------------------------------------------------------------------
            */

            if (req.body.capacity_uom_id) {

                const uom = await Units.findByPk(
                    req.body.capacity_uom_id
                );

                if (!uom) {

                    return res.status(404).json({

                        success: false,

                        message: "Capacity UOM not found.",

                    });

                }

            }

            await updatePackagingMaterial(
                req.params.itemId,
                req.body
            );

            return res.status(200).json({

                success: true,

                message: "Packaging material updated successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

    /**
     * Delete Packaging Material
     */
    static async delete(req, res) {

        try {

            const material = await findByItemId(
                req.params.itemId
            );

            if (!material) {

                return res.status(404).json({

                    success: false,

                    message: "Packaging material not found.",

                });

            }

            await deletePackagingMaterial(
                req.params.itemId
            );

            return res.status(200).json({

                success: true,

                message:
                    "Packaging material deleted successfully.",

            });

        } catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = PackagingMaterialController;