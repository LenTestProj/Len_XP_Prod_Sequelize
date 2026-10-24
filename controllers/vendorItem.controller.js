const { Op } = require("sequelize");

const sequelize = require("../config/database");

const {
    Vendors,
    Items,
    VendorItem,
    VendorItemPriceHistory,
    ItemUomConversion,
} = require("../models");

const {
    createVendorItem,
    createPriceHistory,
    findVendorItemById,
    findVendorItem,
    findPriceHistoryById,
    updateVendorItem,
    updatePriceHistory,
    getVendorItems,
    deactivateVendorItem,
} = require("../services/vendorItem.service");


class VendorItemController {

    /**
     * CREATE VENDOR ITEM + PRICE HISTORY
     *
     * POST /vendor-items
     */
    static async create(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const {
                vendor_id,
                item_id,
                vendor_item_code,
                vendor_item_name,
                purchase_uom_id,
                minimum_order_qty,
                standard_lead_time_days,
                preferred_vendor = false,
                is_active = true,
                prices = [],
            } = req.body;


            /**
             * Check Vendor
             */
            const vendor =
                await Vendors.findOne({

                    where: {
                        id: vendor_id,
                        is_active: true,
                    },

                    transaction,
                });


            if (!vendor) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor not found or inactive.",
                });
            }


            /**
             * Check Item
             */
            const item =
                await Items.findOne({

                    where: {
                        id: item_id,
                    },

                    transaction,
                });


            if (!item) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Item not found.",
                });
            }


            /**
             * Ensure Vendor and Item belong
             * to same organisation
             */
            if (
                Number(vendor.organisation_id) !==
                Number(item.organisation_id)
            ) {

                await transaction.rollback();

                return res.status(400).json({

                    success: false,

                    message:
                        "Vendor and Item must belong to the same organisation.",
                });
            }


            /**
             * Check Duplicate Vendor Item
             */
            const existing =
                await findVendorItem(
                    vendor_id,
                    item_id,
                    transaction
                );


            if (existing) {

                await transaction.rollback();

                return res.status(409).json({

                    success: false,

                    message:
                        "This item is already mapped to this vendor.",
                });
            }


            /**
             * UOM validation
             *
             * If purchase UOM != base UOM,
             * conversion must exist.
             */
            if (
                Number(purchase_uom_id) !==
                Number(item.base_uom_id)
            ) {

                const conversion =
                    await ItemUomConversion.findOne({

                        where: {

                            item_id,

                            from_uom_id:
                                purchase_uom_id,

                            to_uom_id:
                                item.base_uom_id,

                            is_purchase_conversion: true,
                        },

                        transaction,
                    });


                if (!conversion) {

                    await transaction.rollback();

                    return res.status(400).json({

                        success: false,

                        message:
                            "Purchase UOM conversion is not configured for this item.",
                    });
                }
            }


            /**
             * Preferred Vendor
             *
             * Only one preferred vendor
             * per item.
             */
            if (preferred_vendor === true) {

                await VendorItem.update(

                    {
                        preferred_vendor: false,
                    },

                    {
                        where: {
                            item_id,
                            preferred_vendor: true,
                        },

                        transaction,
                    }
                );
            }


            /**
             * Create Vendor Item
             */
            const vendorItem =
                await createVendorItem(

                    {
                        vendor_id,
                        item_id,
                        vendor_item_code,
                        vendor_item_name,
                        purchase_uom_id,
                        minimum_order_qty,
                        standard_lead_time_days,
                        preferred_vendor,
                        is_active,
                    },

                    transaction
                );


            /**
             * Create Price History
             */
            for (const price of prices) {

                const {
                    effective_from,
                    effective_to,
                    currency_code = "GBP",
                    price_uom_id,
                    minimum_qty = 0,
                    basic_unit_price,
                    discount_percent = 0,
                    freight_per_unit = 0,
                    other_charge_per_unit = 0,
                    source_type = "MANUAL",
                    reference_no,
                    remarks,
                } = price;


                /**
                 * Date Validation
                 */
                if (
                    effective_to &&
                    new Date(effective_to) <
                    new Date(effective_from)
                ) {

                    throw new Error(
                        "Price effective_to cannot be before effective_from."
                    );
                }


                /**
                 * Price UOM Conversion
                 */
                if (
                    Number(price_uom_id) !==
                    Number(item.base_uom_id)
                ) {

                    const conversion =
                        await ItemUomConversion.findOne({

                            where: {

                                item_id,

                                from_uom_id:
                                    price_uom_id,

                                to_uom_id:
                                    item.base_uom_id,

                                is_purchase_conversion: true,
                            },

                            transaction,
                        });


                    if (!conversion) {

                        throw new Error(
                            "Price UOM conversion is not configured for this item."
                        );
                    }
                }


                /**
                 * Calculate Net Price
                 */
                const netUnitPrice =
                    Number(basic_unit_price) -
                    (
                        Number(basic_unit_price) *
                        Number(discount_percent)
                        / 100
                    ) +
                    Number(freight_per_unit) +
                    Number(other_charge_per_unit);


                /**
                 * Create Price
                 */
                await createPriceHistory(

                    {
                        vendor_item_id:
                            vendorItem.id,

                        effective_from,

                        effective_to,

                        currency_code,

                        price_uom_id,

                        minimum_qty,

                        basic_unit_price,

                        discount_percent,

                        freight_per_unit,

                        other_charge_per_unit,

                        net_unit_price:
                            netUnitPrice,

                        source_type,

                        reference_no,

                        remarks,
                    },

                    transaction
                );
            }


            const result =
                await findVendorItemById(
                    vendorItem.id,
                    transaction
                );

            await transaction.commit();


            return res.status(201).json({

                success: true,

                message:
                    "Vendor item and price history created successfully.",

                data: result,
            });


        } catch (error) {

            if (!transaction.finished) {
                await transaction.rollback();
            }

            console.error(
                "Create Vendor Item Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to create vendor item.",

                error:
                    error.message,
            });
        }
    }


    /**
     * GET VENDOR ITEMS
     *
     * GET /vendors/:vendorId/items
     */
    static async list(req, res) {

        try {

            const {
                page = 1,
                limit = 10,
                search = "",
                item_id,
                is_active,
            } = req.query;


            const result =
                await getVendorItems({

                    vendor_id:
                        req.params.vendorId,

                    page: Number(page),

                    limit: Number(limit),

                    search,

                    item_id:
                        item_id
                            ? Number(item_id)
                            : undefined,

                    is_active:
                        is_active !== undefined
                            ? is_active === "true"
                            : undefined,
                });


            return res.status(200).json({

                success: true,

                message:
                    "Vendor items fetched successfully.",

                data: result.rows,

                pagination: {

                    total: result.count,

                    page: Number(page),

                    limit: Number(limit),

                    totalPages:
                        Math.ceil(
                            result.count /
                            Number(limit)
                        ),
                },
            });


        } catch (error) {

            console.error(
                "List Vendor Items Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch vendor items.",

                error: error.message,
            });
        }
    }


    /**
     * GET VENDOR ITEM + PRICES
     *
     * GET /vendor-items/:id
     */
    static async getById(req, res) {

        try {

            const vendorItem =
                await findVendorItemById(
                    req.params.id
                );


            if (!vendorItem) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor item not found.",
                });
            }


            return res.status(200).json({

                success: true,

                message:
                    "Vendor item fetched successfully.",

                data: vendorItem,
            });


        } catch (error) {

            console.error(
                "Get Vendor Item Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch vendor item.",

                error: error.message,
            });
        }
    }


    /**
     * UPDATE VENDOR ITEM + PRICE HISTORY
     *
     * PUT /vendor-items/:id
     */
    static async update(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const vendorItem =
                await findVendorItemById(
                    req.params.id,
                    transaction
                );


            if (!vendorItem) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor item not found.",
                });
            }


            const {
                vendor_item_code,
                vendor_item_name,
                purchase_uom_id,
                minimum_order_qty,
                standard_lead_time_days,
                preferred_vendor,
                is_active,
                prices = [],
            } = req.body;


            const updateData = {};


            if (
                vendor_item_code !== undefined
            ) {
                updateData.vendor_item_code =
                    vendor_item_code;
            }

            if (
                vendor_item_name !== undefined
            ) {
                updateData.vendor_item_name =
                    vendor_item_name;
            }

            if (
                purchase_uom_id !== undefined
            ) {

                if (
                    Number(purchase_uom_id) !==
                    Number(vendorItem.item.base_uom_id)
                ) {

                    const conversion =
                        await ItemUomConversion.findOne({

                            where: {

                                item_id:
                                    vendorItem.item_id,

                                from_uom_id:
                                    purchase_uom_id,

                                to_uom_id:
                                    vendorItem.item.base_uom_id,

                                is_purchase_conversion: true,
                            },

                            transaction,
                        });


                    if (!conversion) {

                        throw new Error(
                            "Purchase UOM conversion is not configured for this item."
                        );
                    }
                }


                updateData.purchase_uom_id =
                    purchase_uom_id;
            }


            if (
                minimum_order_qty !== undefined
            ) {

                updateData.minimum_order_qty =
                    minimum_order_qty;
            }

            if (
                standard_lead_time_days !== undefined
            ) {

                updateData.standard_lead_time_days =
                    standard_lead_time_days;
            }


            if (
                preferred_vendor !== undefined
            ) {

                if (
                    preferred_vendor === true
                ) {

                    await VendorItem.update(

                        {
                            preferred_vendor: false,
                        },

                        {
                            where: {

                                item_id:
                                    vendorItem.item_id,

                                preferred_vendor: true,

                                id: {
                                    [Op.ne]:
                                        vendorItem.id,
                                },
                            },

                            transaction,
                        }
                    );
                }


                updateData.preferred_vendor =
                    preferred_vendor;
            }


            if (is_active !== undefined) {

                updateData.is_active =
                    is_active;
            }


            /**
             * Update Vendor Item
             */
            if (
                Object.keys(updateData).length
            ) {

                await updateVendorItem(

                    vendorItem.id,

                    updateData,

                    transaction
                );
            }


            /**
             * Add / Update Price History
             *
             * Existing price:
             *     prices[].id
             *
             * New price:
             *     no id
             */
            for (const price of prices) {

                const {
                    id,

                    effective_from,
                    effective_to,

                    currency_code = "GBP",

                    price_uom_id,

                    minimum_qty = 0,

                    basic_unit_price,

                    discount_percent = 0,

                    freight_per_unit = 0,

                    other_charge_per_unit = 0,

                    source_type = "MANUAL",

                    reference_no,

                    remarks,
                } = price;


                /**
                 * Validate Dates
                 */
                if (
                    effective_to &&
                    new Date(effective_to) <
                    new Date(effective_from)
                ) {

                    throw new Error(
                        "Price effective_to cannot be before effective_from."
                    );
                }


                /**
                 * Validate UOM Conversion
                 */
                if (
                    Number(price_uom_id) !==
                    Number(vendorItem.item.base_uom_id)
                ) {

                    const conversion =
                        await ItemUomConversion.findOne({

                            where: {

                                item_id:
                                    vendorItem.item_id,

                                from_uom_id:
                                    price_uom_id,

                                to_uom_id:
                                    vendorItem.item.base_uom_id,

                                is_purchase_conversion: true,
                            },

                            transaction,
                        });


                    if (!conversion) {

                        throw new Error(
                            "Price UOM conversion is not configured for this item."
                        );
                    }
                }


                /**
                 * Calculate Net Price
                 */
                const netUnitPrice =
                    Number(basic_unit_price) -
                    (
                        Number(basic_unit_price) *
                        Number(discount_percent)
                        / 100
                    ) +
                    Number(freight_per_unit) +
                    Number(other_charge_per_unit);


                const priceData = {

                    vendor_item_id:
                        vendorItem.id,

                    effective_from,

                    effective_to,

                    currency_code,

                    price_uom_id,

                    minimum_qty,

                    basic_unit_price,

                    discount_percent,

                    freight_per_unit,

                    other_charge_per_unit,

                    net_unit_price:
                        netUnitPrice,

                    source_type,

                    reference_no,

                    remarks,
                };


                /**
                 * Existing Price
                 */
                if (id) {

                    const existingPrice =
                        await findPriceHistoryById(
                            id,
                            transaction
                        );


                    if (!existingPrice) {

                        throw new Error(
                            `Price history ID ${id} not found.`
                        );
                    }


                    if (
                        Number(
                            existingPrice.vendor_item_id
                        ) !==
                        Number(vendorItem.id)
                    ) {

                        throw new Error(
                            "Price history does not belong to this vendor item."
                        );
                    }


                    delete priceData.vendor_item_id;


                    await updatePriceHistory(

                        id,

                        priceData,

                        transaction
                    );
                }

                /**
                 * New Price
                 */
                else {

                    await createPriceHistory(

                        priceData,

                        transaction
                    );
                }
            }


            await transaction.commit();


            const result =
                await findVendorItemById(
                    vendorItem.id
                );


            return res.status(200).json({

                success: true,

                message:
                    "Vendor item and price history updated successfully.",

                data: result,
            });


        } catch (error) {

            await transaction.rollback();

            console.error(
                "Update Vendor Item Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update vendor item.",

                error: error.message,
            });
        }
    }


    /**
     * DELETE /vendor-items/:id
     *
     * Soft delete
     */
    static async delete(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const vendorItem =
                await findVendorItemById(
                    req.params.id,
                    transaction
                );


            if (!vendorItem) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor item not found.",
                });
            }


            await deactivateVendorItem(

                vendorItem.id,

                transaction
            );


            await transaction.commit();


            return res.status(200).json({

                success: true,

                message:
                    "Vendor item deactivated successfully.",
            });


        } catch (error) {

            await transaction.rollback();

            console.error(
                "Delete Vendor Item Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to deactivate vendor item.",

                error: error.message,
            });
        }
    }
}


module.exports = VendorItemController;