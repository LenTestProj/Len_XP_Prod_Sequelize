const {
    findOrganisationByCode,
    findOrganisationById,
    createOrganisation,
    getOrganisations,
    updateOrganisation,
    deleteOrganisation,
} = require("../services/organisation.service");
const { generateOrganisationCode } = require("../helpers/unique.code.helper");
class OrganisationController {

    /**
     * Create Organisation
     */
    static async create(req, res) {

        try {

            const {
                // organisation_code,
                organisation_name,
                base_currency,
                is_active,
            } = req.body;
            const organisation_code = await generateOrganisationCode();
            // const organisationExists =
            //     await findOrganisationByCode(
            //         organisation_code.trim()
            //     );

            // if (organisationExists) {

            //     return res.status(409).json({
            //         success: false,
            //         message: "Organisation code already exists.",
            //     });

            // }

            const organisation =
                await createOrganisation({

                    organisation_code,
                    organisation_name:
                        organisation_name.trim(),

                    base_currency:
                        base_currency.toUpperCase(),

                    is_active,

                });

            return res.status(201).json({

                success: true,

                message:
                    "Organisation created successfully.",

                data: organisation,

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
     * Organisation List
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

            const organisations =
                await getOrganisations({

                    page,

                    limit,

                    search,

                    sortBy,

                    sortOrder,

                });

            return res.status(200).json({

                success: true,

                totalRecords:
                    organisations.count,

                totalPages: Math.ceil(
                    organisations.count /
                    Number(limit)
                ),

                currentPage:
                    Number(page),

                data:
                    organisations.rows,

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
     * Get Organisation By Id
     */
    static async getById(req, res) {

        try {

            const organisation =
                await findOrganisationById(
                    req.params.id
                );

            if (!organisation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: organisation,

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
     * Update Organisation
     */
    static async update(req, res) {

        try {

            const organisation =
                await findOrganisationById(
                    req.params.id
                );

            if (!organisation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }

            const duplicate =
                await findOrganisationByCode(
                    // req.body.organisation_code.trim(),
                    req.params.id
                );

            if (duplicate) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Organisation code already exists.",

                });

            }

            await updateOrganisation(
                organisation,
                {

                    // organisation_code:
                    //     req.body.organisation_code.trim(),

                    organisation_name:
                        req.body.organisation_name.trim(),

                    base_currency:
                        req.body.base_currency.toUpperCase(),

                    is_active:
                        req.body.is_active,

                }
            );

            return res.status(200).json({

                success: true,

                message:
                    "Organisation updated successfully.",

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
     * Delete Organisation
     */
    static async delete(req, res) {

        try {

            const organisation =
                await findOrganisationById(
                    req.params.id
                );

            if (!organisation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }

            await deleteOrganisation(
                organisation
            );

            return res.status(200).json({

                success: true,

                message:
                    "Organisation deleted successfully.",

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

module.exports = OrganisationController;