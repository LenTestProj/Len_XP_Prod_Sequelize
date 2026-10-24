const { Op } = require("sequelize");

const sequelize =
    require("../config/database");

const {

    Organisation,
    Vendors,
    VendorItem,
    VendorItemPriceHistory,
    Items

} = require("../models");

const {

    createVendor,
    findVendorById,
    findVendorByCode,
    updateVendor,
    deleteVendor,
    getAllVendors,

    createVendorItem,
    findVendorItemById,
    getVendorItems,
    updateVendorItem,
    deleteVendorItem,

    createVendorItemPrice,
    getVendorItemPrices,
    findVendorItemPriceById,
    updateVendorItemPrice,
    deleteVendorItemPrice,

} = require("../services/vendor.service");

const {
    generateVendorCode,
} = require("../helpers/unique.code.helper");


class VendorController {

    static async create(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const {

                organisation_id,
                vendor_name,
                tax_registration_no,
                payment_terms_days,
                is_active,

            } = req.body;


            const organisation =
                await Organisation.findByPk(
                    organisation_id,
                    {
                        transaction,
                    }
                );


            if (!organisation) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }


            const vendor_code =
                await generateVendorCode(
                    transaction
                );


            const existingVendor =
                await findVendorByCode(
                    organisation_id,
                    vendor_code,
                    transaction
                );


            if (existingVendor) {

                await transaction.rollback();

                return res.status(409).json({

                    success: false,

                    message:
                        "Vendor code already exists.",

                });

            }


            const vendor =
                await createVendor({

                    organisation_id,

                    vendor_code,

                    vendor_name:
                        vendor_name.trim(),

                    tax_registration_no:
                        tax_registration_no || null,

                    payment_terms_days:
                        payment_terms_days !== undefined
                            ? payment_terms_days
                            : null,

                    is_active:
                        is_active !== undefined
                            ? is_active
                            : true,

                }, transaction);


            await transaction.commit();


            return res.status(201).json({

                success: true,

                message:
                    "Vendor created successfully.",

                data:
                    vendor,

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while creating vendor.",

            });

        }

    }

    static async list(req, res) {

        try {

            let page =
                Number(req.query.page) || 1;

            let limit =
                Number(req.query.limit) || 10;

            page =
                Math.max(page, 1);

            limit =
                Math.max(limit, 1);


            const result =
                await getAllVendors({

                    page,

                    limit,

                    search:
                        req.query.search,

                    organisation_id:
                        req.query.organisation_id,

                });


            return res.status(200).json({

                success: true,

                totalRecords:
                    result.count,

                totalPages:
                    Math.ceil(
                        result.count / limit
                    ),

                currentPage:
                    page,

                data:
                    result.rows,

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }

    static async getById(req, res) {

        try {

            const vendor =
                await findVendorById(
                    req.params.id
                );


            if (!vendor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor not found.",

                });

            }


            return res.status(200).json({

                success: true,

                data:
                    vendor,

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }

    static async update(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const vendor =
                await Vendors.findByPk(
                    req.params.id,
                    {
                        transaction,
                    }
                );


            if (!vendor) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor not found.",

                });

            }


            const {
                organisation_id,
                vendor_name,
                tax_registration_no,
                payment_terms_days,
                is_active,
            } = req.body;


            const organisation =
                await Organisation.findByPk(
                    organisation_id,
                    {
                        transaction,
                    }
                );


            if (!organisation) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Organisation not found.",

                });

            }


            await updateVendor(

                req.params.id,

                {

                    organisation_id,

                    // vendor_code intentionally not changed

                    vendor_name:
                        vendor_name.trim(),

                    tax_registration_no:
                        tax_registration_no || null,

                    payment_terms_days:
                        payment_terms_days !== undefined
                            ? payment_terms_days
                            : null,

                    is_active:
                        is_active !== undefined
                            ? is_active
                            : vendor.is_active,

                },

                transaction

            );


            await transaction.commit();


            const updatedVendor =
                await findVendorById(
                    req.params.id
                );


            return res.status(200).json({

                success: true,

                message:
                    "Vendor updated successfully.",

                data:
                    updatedVendor,

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }

    static async delete(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const vendor =
                await Vendors.findByPk(
                    req.params.id,
                    {
                        transaction,
                    }
                );


            if (!vendor) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor not found.",

                });

            }


            const vendorItems =
                await VendorItem.count({

                    where: {
                        vendor_id:
                            vendor.id,
                    },

                    transaction,

                });


            if (vendorItems > 0) {

                await transaction.rollback();

                return res.status(409).json({

                    success: false,

                    message:
                        "Vendor cannot be deleted because vendor items exist.",

                });

            }


            await deleteVendor(
                vendor.id,
                transaction
            );


            await transaction.commit();


            return res.status(200).json({

                success: true,

                message:
                    "Vendor deleted successfully.",

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }

}


module.exports = VendorController;