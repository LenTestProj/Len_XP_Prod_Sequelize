const {
    createFormulation,
    findById,
    existsByCode,
    existsByFinishedProduct,
    updateFormulation,
    deleteFormulation,
    listFormulations,
    listVersions,
    findVersion,
    createVersion,
    updateVersion,
    approveVersion,
    obsoleteVersion,
    deleteVersion,
    addLine,
    updateLine,
    deleteLine,
} = require("../services/formulation.service");
const { generateFormulationCode } = require("../helpers/unique.code.helper");

class FormulationController {

    static async create(req, res) {

        try {

            const {
                organisation_id,
                finished_product_item_id,
                // formulation_code,
                formulation_name,
                formulation_type = "MANUFACTURING",
                is_active = true,

                version = {},
                lines = [],
            } = req.body;
            const formulation_code =
            await generateFormulationCode(
                organisation_id
            );
            // const existingCode =
            //     await existsByCode(
            //         organisation_id,
            //         formulation_code.trim()
            //     );

            // if (existingCode) {

            //     return res.status(409).json({

            //         success: false,

            //         message:
            //             "Formulation code already exists.",
            //     });

            // }
            const existingProduct =
                await existsByFinishedProduct(
                    organisation_id,
                    finished_product_item_id
                );
            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message:
                        "An active formulation already exists for this finished product.",
                });
            }
            const formulation =
                await createFormulation({

                    formulation: {

                        organisation_id,

                        finished_product_item_id,

                        formulation_code,

                        formulation_name:
                            formulation_name.trim(),

                        formulation_type,

                        is_active,

                    },

                    version: {
                        effective_from:
                            version.effective_from ||
                            null,
                        effective_to:
                            version.effective_to ||
                            null,
                        standard_output_qty:
                            version.standard_output_qty,
                        output_uom_id:
                            version.output_uom_id,
                        expected_process_loss_percent:
                            version.expected_process_loss_percent ??
                            0,
                        expected_output_qty:
                            version.expected_output_qty ??
                            version.standard_output_qty,
                        instructions:
                            version.instructions ||
                            null,
                    },
                    lines,
                });
            return res.status(201).json({
                success: true,
                message:
                    "Formulation created successfully.",
                data: formulation,
            });
        } catch (error) {
            console.error(
                "Create formulation error:",
                error
            );
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async getAll(req, res) {
        try {
            const {
                organisation_id,
                search = "",
                formulation_type,
                is_active,
                page = 1,
                limit = 10,
            } = req.query;
            const result =
                await listFormulations({
                    organisation_id,
                    page:
                        Number(page),
                    limit:
                        Number(limit),
                    search,
                    formulation_type,
                    is_active:
                        is_active !== undefined
                            ? is_active === "true"
                            : undefined,
                });
            return res.status(200).json({
                success: true,
                data: result.rows,
                pagination: {
                    totalRecords:
                        result.count,
                    currentPage:
                        Number(page),
                    limit:
                        Number(limit),
                    totalPages:
                        Math.ceil(
                            result.count /
                            Number(limit)
                        ),
                },
            });
        } catch (error) {
            console.error(
                "Get formulations error:",
                error
            );
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async getById(req, res) {
        try {
            const formulation =
                await findById(
                    req.params.id
                );
            if (!formulation) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Formulation not found.",
                });
            }
            return res.status(200).json({
                success: true,
                data: formulation,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async update(req, res) {
        try {
            const {
                organisation_id,
                formulation_name,
                formulation_type,
                is_active,
            } = req.body;
            const payload = {};
            if (
                formulation_name !== undefined
            ) {
                payload.formulation_name =
                    formulation_name.trim();
            }
            if (
                formulation_type !== undefined
            ) {
                payload.formulation_type =
                    formulation_type;
            }
            if (
                is_active !== undefined
            ) {
                payload.is_active =
                    is_active;
            }
            const formulation =
                await updateFormulation(
                    req.params.id,
                    organisation_id,
                    payload
                );
            return res.status(200).json({
                success: true,
                message:
                    "Formulation updated successfully.",
                data: formulation,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }


    static async delete(req, res) {
        try {
           
            await deleteFormulation(
                req.params.id
            );
            return res.status(200).json({
                success: true,
                message:
                    "Formulation deleted successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async createVersion(req, res) {
        try {
            const {
                standard_output_qty,
                output_uom_id,
                effective_from,
                effective_to,
                expected_process_loss_percent = 0,
                expected_output_qty,
                instructions,
                lines = [],
            } = req.body;
            const version =
                await createVersion({
                    formulationId:
                        req.params.id,
                    version: {
                        standard_output_qty,
                        output_uom_id,
                        effective_from:
                            effective_from ||
                            null,
                        effective_to:
                            effective_to ||
                            null,
                        expected_process_loss_percent,
                        expected_output_qty:
                            expected_output_qty ??
                            standard_output_qty,
                        instructions:
                            instructions ||
                            null,
                    },
                    lines,
                });
            return res.status(201).json({
                success: true,
                message:
                    "Formulation version created successfully.",
                data: version,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getVersions(req, res) {
        try {
            const versions =
                await listVersions(
                    req.params.id
                );
            return res.status(200).json({
                success: true,
                data: versions,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async getVersion(req, res) {
        try {
            const version =
                await findVersion(
                    req.params.id,
                    req.params.versionId
                );
            if (!version) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Formulation version not found.",
                });
            }
            return res.status(200).json({
                success: true,
                data: version,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async updateVersion(req, res) {
        try {
            const {
                standard_output_qty,
                output_uom_id,
                effective_from,
                effective_to,
                expected_process_loss_percent,
                expected_output_qty,
                instructions,
                lines,
            } = req.body;
            const versionPayload = {};
            if (
                standard_output_qty !== undefined
            ) {
                versionPayload.standard_output_qty =
                    standard_output_qty;
            }
            if (
                output_uom_id !== undefined
            ) {
                versionPayload.output_uom_id =
                    output_uom_id;
            }
            if (
                effective_from !== undefined
            ) {
                versionPayload.effective_from =
                    effective_from;
            }
            if (
                effective_to !== undefined
            ) {
                versionPayload.effective_to =
                    effective_to;
            }
            if (
                expected_process_loss_percent !==
                undefined
            ) {
                versionPayload.expected_process_loss_percent =
                    expected_process_loss_percent;
            }
            if (
                expected_output_qty !== undefined
            ) {
                versionPayload.expected_output_qty =
                    expected_output_qty;
            }
            if (
                instructions !== undefined
            ) {
                versionPayload.instructions =
                    instructions;
            }
            const version =
                await updateVersion(
                    req.params.id,
                    req.params.versionId,
                    versionPayload,
                    lines
                );
            return res.status(200).json({
                success: true,
                message:
                    "Draft formulation version updated successfully.",
                data: version,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async approveVersion(req, res) {
        try {
            const {
                approved_by,
            } = req.body;
            const version =
                await approveVersion({
                    formulationId:
                        req.params.id,
                    versionId:
                        req.params.versionId,
                    approvedBy:
                        approved_by,
                });
            return res.status(200).json({
                success: true,
                message:
                    "Formulation version approved successfully.",
                data: version,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async obsoleteVersion(req, res) {
        try {
            const version =
                await obsoleteVersion(
                    req.params.id,
                    req.params.versionId
                );
            return res.status(200).json({
                success: true,
                message:
                    "Formulation version marked obsolete successfully.",
                data: version,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async deleteVersion(req, res) {
        try {
            await deleteVersion(
                req.params.id,
                req.params.versionId
            );
            return res.status(200).json({
                success: true,
                message:
                    "Draft formulation version deleted successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async addLine(req, res) {
        try {
            const line =
                await addLine(
                    req.params.id,
                    req.params.versionId,
                    req.body
                );
            return res.status(201).json({
                success: true,
                message:
                    "Formulation line added successfully.",
                data: line,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async updateLine(req, res) {
        try {
            const line =
                await updateLine(
                    req.params.id,
                    req.params.versionId,
                    req.params.lineId,
                    req.body
                );
            return res.status(200).json({
                success: true,
                message:
                    "Formulation line updated successfully.",
                data: line,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async deleteLine(req, res) {
        try {
            await deleteLine(
                req.params.id,
                req.params.versionId,
                req.params.lineId
            );
            return res.status(200).json({
                success: true,
                message:
                    "Formulation line deleted successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
module.exports = FormulationController;