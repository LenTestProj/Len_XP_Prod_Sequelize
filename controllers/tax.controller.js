const {
    createTax,
    findTaxById,
    findTaxByHsnCode,
    getTaxes,
    updateTax,
    deleteTax,
} = require("../services/tax.service");

class TaxController {

    /**
     * Create Tax
     */
    static async create(req, res) {

        try {

            const {
                hsn_code,
                tax_type,
                description,
                cgst ,
                sgst ,
                igst ,
                status,
            } = req.body;

            /*
            |--------------------------------------------------------------------------
            | Duplicate HSN Code
            |--------------------------------------------------------------------------
            */

            const taxExists = await findTaxByHsnCode(
                hsn_code.trim().toUpperCase()
            );

            if (taxExists) {

                return res.status(409).json({
                    success: false,
                    message: "HSN Code already exists.",
                });

            }

            /*
            |--------------------------------------------------------------------------
            | Total Tax
            |--------------------------------------------------------------------------
            */

            const total_tax =
                Number(igst) > 0
                    ? Number(igst)
                    : Number(cgst) + Number(sgst);

            const tax = await createTax({

                hsn_code: hsn_code.trim().toUpperCase(),

                tax_type,

                description: description.trim(),

                cgst,

                sgst,

                igst,

                total_tax,

                status,

            });

            return res.status(201).json({

                success: true,

                message: "Tax created successfully.",

                data: tax,

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
     * Tax List
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

            const taxes = await getTaxes({

                page,

                limit,

                search,

                sortBy,

                sortOrder,

            });

            return res.status(200).json({

                success: true,

                message: "Taxes fetched successfully.",

                totalRecords: taxes.count,

                totalPages: Math.ceil(
                    taxes.count / Number(limit)
                ),

                currentPage: Number(page),

                data: taxes.rows,

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
     * Get Tax By Id
     */
    static async getById(req, res) {

        try {

            const tax = await findTaxById(req.params.id);

            if (!tax) {

                return res.status(404).json({

                    success: false,

                    message: "Tax not found.",

                });

            }

            return res.status(200).json({

                success: true,

                data: tax,

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
     * Update Tax
     */
    static async update(req, res) {

        try {

            const tax = await findTaxById(req.params.id);

            if (!tax) {

                return res.status(404).json({

                    success: false,

                    message: "Tax not found.",

                });

            }

            const duplicateTax = await findTaxByHsnCode(

                req.body.hsn_code.trim().toUpperCase(),

                req.params.id

            );

            if (duplicateTax) {

                return res.status(409).json({

                    success: false,

                    message: "HSN Code already exists.",

                });

            }

            const total_tax =
                Number(req.body.igst) > 0
                    ? Number(req.body.igst)
                    : Number(req.body.cgst) +
                      Number(req.body.sgst);

            await updateTax(tax, {

                hsn_code: req.body.hsn_code
                    .trim()
                    .toUpperCase(),

                tax_type: req.body.tax_type,

                description: req.body.description.trim(),

                cgst: req.body.cgst,

                sgst: req.body.sgst,

                igst: req.body.igst,

                total_tax,

                status: req.body.status,

            });

            return res.status(200).json({

                success: true,
                data:tax,
                message: "Tax updated successfully.",

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
     * Delete Tax
     */
    static async delete(req, res) {

        try {

            const tax = await findTaxById(req.params.id);

            if (!tax) {

                return res.status(404).json({

                    success: false,

                    message: "Tax not found.",

                });

            }

            await deleteTax(tax);

            return res.status(200).json({

                success: true,

                message: "Tax deleted successfully.",

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

module.exports = TaxController;