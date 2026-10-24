const {
    createUnit,
    findUnitById,
    findUnitByName,
    findUnitByCode,
    getUnits,
    updateUnit,
    deleteUnit,
} = require("../services/unit.service");


class UnitController {

    /**
     * Create Unit
     */
    static async create(req, res) {

        try {

            const {
                name,
                code,
                status,
                dimension,
                decimal_places
            } = req.body;

            const unitName = await findUnitByName(name.trim());

            if (unitName) {

                return res.status(409).json({
                    success: false,
                    message: "Unit name already exists.",
                });

            }

            const unitCode = await findUnitByCode(
                code.trim().toUpperCase()
            );

            if (unitCode) {

                return res.status(409).json({
                    success: false,
                    message: "Unit code already exists.",
                });

            }

            const unit = await createUnit({

                name: name.trim(),
                code: code.trim().toUpperCase(),
                dimension,
                decimal_places,
                status,

            });

            return res.status(201).json({

                success: true,

                message: "Unit created successfully.",

                data: unit,

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
     * Unit List
     */
    static async list(req, res) {

        try {

            const {

                page = 1,

                limit = 10,

                search = "",

                sortBy = "created_at",

                sortOrder = "DESC",

            } = req.query;

            const units = await getUnits({

                page,

                limit,

                search,

                sortBy,

                sortOrder,

            });

            return res.status(200).json({

                success: true,

                message: "Units fetched successfully.",

                totalRecords: units.count,

                totalPages: Math.ceil(
                    units.count / Number(limit)
                ),

                currentPage: Number(page),

                data: units.rows,

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
     * Get Unit By Id
     */
    static async getById(req, res) {

        try {

            const unit = await findUnitById(req.params.id);

            if (!unit) {

                return res.status(404).json({

                    success: false,

                    message: "Unit not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: unit,

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
     * Update Unit
     */
    static async update(req, res) {

        try {

            const unit = await findUnitById(req.params.id);

            if (!unit) {

                return res.status(404).json({

                    success: false,

                    message: "Unit not found.",

                });

            }

            const duplicateName = await findUnitByName(

                req.body.name.trim(),

                req.params.id

            );

            if (duplicateName) {

                return res.status(409).json({

                    success: false,

                    message: "Unit name already exists.",

                });

            }

            const duplicateCode = await findUnitByCode(

                req.body.code.trim().toUpperCase(),

                req.params.id

            );

            if (duplicateCode) {

                return res.status(409).json({

                    success: false,

                    message: "Unit code already exists.",

                });

            }

            await updateUnit(unit, {

                name: req.body.name.trim(),
                code: req.body.code.trim().toUpperCase(),
                dimension: req.body.dimension,
                decimal_places: req.body.decimal_places,
                status: req.body.status,

            });

            return res.status(200).json({

                success: true,
                data:unit,
                message: "Unit updated successfully.",

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
     * Delete Unit
     */
    static async delete(req, res) {

        try {

            const unit = await findUnitById(req.params.id);

            if (!unit) {

                return res.status(404).json({

                    success: false,

                    message: "Unit not found.",

                });

            }

            await deleteUnit(unit);

            return res.status(200).json({

                success: true,

                message: "Unit deleted successfully.",

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }

}

module.exports = UnitController;