const {
    createItem,
    findById,
    findByCode,
    updateItem,
    deleteItem,
    getAllItems,
} = require("../services/item.service");
const sequelize = require("../config/database");
const {
    Organisation,
    Units,
    Items,
    RawMaterialDetails,
    PackagingMaterialDetails,
    FinishedProductDetails,
} = require("../models");
const { generateItemCode } = require("../helpers/unique.code.helper");
class ItemController {

    /**
     * Create Item
     * POST /items
     */
    // static async create(req, res) {

    //     // try {

    //     //     const {
    //     //         organisation_id,
    //     //         item_code,
    //     //         item_name,
    //     //         item_type,
    //     //         base_uom_id,
    //     //         batch_tracking_required,
    //     //         expiry_tracking_required,
    //     //         shelf_life_days,
    //     //         inventory_valuation_method,
    //     //         standard_cost,
    //     //         last_purchase_cost,
    //     //         minimum_stock_qty,
    //     //         reorder_qty,
    //     //         is_purchase_item,
    //     //         is_manufactured_item,
    //     //         is_sale_item,
    //     //     } = req.body;

    //     //     /*
    //     //     |--------------------------------------------------------------------------
    //     //     | Check Organisation
    //     //     |--------------------------------------------------------------------------
    //     //     */

    //     //     const organisation = await Organisation.findByPk(
    //     //         organisation_id
    //     //     );

    //     //     if (!organisation) {

    //     //         return res.status(404).json({
    //     //             success: false,
    //     //             message: "Organisation not found.",
    //     //         });

    //     //     }

    //     //     /*
    //     //     |--------------------------------------------------------------------------
    //     //     | Check Base UOM
    //     //     |--------------------------------------------------------------------------
    //     //     */

    //     //     const unit = await Units.findByPk(
    //     //         base_uom_id
    //     //     );

    //     //     if (!unit) {

    //     //         return res.status(404).json({
    //     //             success: false,
    //     //             message: "Base unit not found.",
    //     //         });

    //     //     }

    //     //     /*
    //     //     |--------------------------------------------------------------------------
    //     //     | Duplicate Item Code
    //     //     |--------------------------------------------------------------------------
    //     //     */

    //     //     const codeExists = await findByCode(
    //     //         organisation_id,
    //     //         item_code
    //     //     );

    //     //     if (codeExists) {

    //     //         return res.status(409).json({
    //     //             success: false,
    //     //             message: "Item code already exists.",
    //     //         });

    //     //     }

    //     //     /*
    //     //     |--------------------------------------------------------------------------
    //     //     | Create Item
    //     //     |--------------------------------------------------------------------------
    //     //     */

    //     //     const item = await createItem({

    //     //         organisation_id,
    //     //         item_code,
    //     //         item_name,
    //     //         item_type,
    //     //         base_uom_id,

    //     //         batch_tracking_required,
    //     //         expiry_tracking_required,
    //     //         shelf_life_days,

    //     //         inventory_valuation_method,

    //     //         standard_cost,
    //     //         last_purchase_cost,

    //     //         minimum_stock_qty,
    //     //         reorder_qty,

    //     //         is_purchase_item,
    //     //         is_manufactured_item,
    //     //         is_sale_item,

    //     //     });

    //     //     return res.status(201).json({

    //     //         success: true,

    //     //         message: "Item created successfully.",

    //     //         data: item,

    //     //     });

    //     // } catch (error) {

    //     //     console.error(error);

    //     //     return res.status(500).json({

    //     //         success: false,

    //     //         message: error.message,

    //     //     });

    //     // }
    //     const transaction = await sequelize.transaction();

    //     try {
    //           const {
    //             organisation_id,
    //             item_code,
    //             item_name,
    //             item_type,
    //             base_uom_id,
    //             batch_tracking_required,
    //             expiry_tracking_required,
    //             shelf_life_days,
    //             inventory_valuation_method,
    //             standard_cost,
    //             last_purchase_cost,
    //             minimum_stock_qty,
    //             reorder_qty,
    //             is_purchase_item,
    //             is_manufactured_item,
    //             is_sale_item,
    //         } = req.body;
    //         const item = await createItem({

    //             organisation_id,
    //             item_code,
    //             item_name,
    //             item_type,
    //             base_uom_id,
    //             batch_tracking_required,
    //             expiry_tracking_required,
    //             shelf_life_days,
    //             inventory_valuation_method,
    //             standard_cost,
    //             last_purchase_cost,
    //             minimum_stock_qty,
    //             reorder_qty,
    //             is_purchase_item,
    //             is_manufactured_item,
    //             is_sale_item,

    //         }, transaction);


    //         if (item_type === "RAW_MATERIAL") {

    //             await RawMaterialDetails.create({

    //                 item_id: item.id,

    //                 ...(req.body.rawMaterialDetails)

    //             }, { transaction });

    //         }

    //         else if (item_type === "PACKAGING_MATERIAL") {

    //             await PackagingMaterialDetails.create({

    //                 item_id: item.id,

    //                 ...(req.body.packagingMaterialDetails)

    //             }, { transaction });

    //         }

    //         else if (item_type === "FINISHED_PRODUCT") {

    //             await FinishedProductDetails.create({

    //                 item_id: item.id,

    //                 ...(req.body.finishedProductDetails)

    //             }, { transaction });

    //         }

    //         await transaction.commit();

    //         return res.status(201).json({

    //             success: true,

    //             message: "Item created successfully.",

    //             data: item

    //         });

    //     }
    //     catch (error) {

    //         console.error(error);

    //         await transaction.rollback();

    //         return res.status(500).json({

    //             success: false,

    //             message: error.message || "Something went wrong while creating the item.",

    //         });

    //     }

    // }
    static async create(req, res) {

        const transaction = await sequelize.transaction();

        try {

            const {
                organisation_id,
                // item_code,
                item_name,
                item_type,
                base_uom_id,
                tax_id,
                batch_tracking_required,
                expiry_tracking_required,
                shelf_life_days,
                inventory_valuation_method,
                standard_cost,
                last_purchase_cost,
                minimum_stock_qty,
                reorder_qty,
                is_purchase_item,
                is_manufactured_item,
                is_sale_item,

                rawMaterialDetails,
                packagingMaterialDetails,
                finishedProductDetails,

            } = req.body;
            const item_code = await generateItemCode(
                organisation_id,
                transaction
            );
            const organisation = await Organisation.findByPk(
                organisation_id,
                {
                    transaction,
                }
            );

            if (!organisation) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message: "Organisation not found.",

                });

            }
           
            const unit = await Units.findByPk(base_uom_id, {
                transaction,
            });

            if (!unit) {

                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: "Base UOM not found.",
                });
            }
            /*
            |--------------------------------------------------------------------------
            | Create Main Item
            |--------------------------------------------------------------------------
            */

            const item = await createItem({

                organisation_id,
                item_code,
                item_name,
                item_type,
                base_uom_id,
                tax_id,
                batch_tracking_required,
                expiry_tracking_required,
                shelf_life_days,
                inventory_valuation_method,
                standard_cost,
                last_purchase_cost,
                minimum_stock_qty,
                reorder_qty,
                is_purchase_item,
                is_manufactured_item,
                is_sale_item,

            }, transaction);

            let details = null;
            /*
            |--------------------------------------------------------------------------
            | Create Item Type Details
            |--------------------------------------------------------------------------
            */

            if (item_type === "RAW_MATERIAL") {

               details = await RawMaterialDetails.create({

                    item_id: item.id,

                    ...(rawMaterialDetails || {}),

                }, {
                    transaction,
                });

            }

            else if (item_type === "PACKAGING_MATERIAL") {

               details = await PackagingMaterialDetails.create({

                    item_id: item.id,

                    ...(packagingMaterialDetails || {}),

                }, {
                    transaction,
                });

            }

            else if (item_type === "FINISHED_PRODUCT") {

              details = await FinishedProductDetails.create({

                    item_id: item.id,

                    ...(finishedProductDetails || {}),

                }, {
                    transaction,
                });

            }


            /*
            |--------------------------------------------------------------------------
            | Commit Transaction
            |--------------------------------------------------------------------------
            */

            await transaction.commit();


            return res.status(201).json({

                success: true,

                message: "Item created successfully.",

                data:{

                ...item.toJSON(),

                details: details
                    ? details.toJSON()
                    : null,

            },

            });

        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while creating the item.",

            });

        }

    }
    /**
     * Get All Items
     */
    // static async list(req, res) {

    //     try {

    //         const page = Number(req.query.page) || 1;
    //         const limit = Number(req.query.limit) || 10;

    //         const result = await getAllItems({

    //             page,
    //             limit,

    //             search: req.query.search,

    //             organisation_id: req.query.organisation_id,

    //             item_type: req.query.item_type,

    //         });

    //         return res.status(200).json({

    //             success: true,

    //             totalRecords: result.count,

    //             totalPages: Math.ceil(
    //                 result.count / limit
    //             ),

    //             currentPage: page,

    //             data: result.rows,

    //         });

    //     } catch (error) {

    //         return res.status(500).json({

    //             success: false,

    //             message: error.message,

    //         });

    //     }

    // }
    static async list(req, res) {
        try {

            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 10;

            page = Math.max(page, 1);
            limit = Math.max(limit, 1);

            const result = await getAllItems({
                page,
                limit,
                search: req.query.search,
                organisation_id: req.query.organisation_id,
                item_type: req.query.item_type,
            });

           

            return res.status(200).json({
                success: true,
                totalRecords: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page,
                data: result.rows,
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
     * Get Item By Id
     */
    // static async getById(req, res) {

    //     try {

    //         const item = await findById(
    //             req.params.id
    //         );

    //         if (!item) {

    //             return res.status(404).json({

    //                 success: false,

    //                 message: "Item not found.",

    //             });

    //         }

    //         return res.status(200).json({

    //             success: true,

    //             data: item,

    //         });

    //     } catch (error) {

    //         return res.status(500).json({

    //             success: false,

    //             message: error.message,

    //         });

    //     }

    // }
    static async getById(req, res) {
    try {
        const item = await findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found.",
            });
        }


        return res.status(200).json({
            success: true,
            data: {
                ...item.toJSON(),
            },
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
     * Update Item
     */
    // static async update(req, res) {

    //     try {

    //         const item = await findById(
    //             req.params.id
    //         );

    //         if (!item) {

    //             return res.status(404).json({

    //                 success: false,

    //                 message: "Item not found.",

    //             });

    //         }

    //         await updateItem(
    //             req.params.id,
    //             req.body
    //         );

    //         return res.status(200).json({

    //             success: true,

    //             message: "Item updated successfully.",

    //         });

    //     } catch (error) {

    //         return res.status(500).json({

    //             success: false,

    //             message: error.message,

    //         });

    //     }

    // }
    static async update(req, res) {

    const transaction = await sequelize.transaction();
        try {
             
            const item = await findById(req.params.id);

            if (!item) {

                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: "Item not found.",
                });
            }

            const {
                organisation_id,
                item_name,
                item_type,
                base_uom_id,
                tax_id,
                batch_tracking_required,
                expiry_tracking_required,
                shelf_life_days,
                inventory_valuation_method,
                standard_cost,
                last_purchase_cost,
                minimum_stock_qty,
                reorder_qty,
                is_purchase_item,
                is_manufactured_item,
                is_sale_item,
                rawMaterialDetails,
                packagingMaterialDetails,
                finishedProductDetails,
            } = req.body;
             const organisation = await Organisation.findByPk(
                organisation_id,
                {
                    transaction,
                }
            );

            if (!organisation) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message: "Organisation not found.",

                });

            }

            /*
            |--------------------------------------------------------------------------
            | Update Main Item
            |--------------------------------------------------------------------------
            */

            await updateItem(
                req.params.id,
                {
                    organisation_id,
                    item_name,
                    item_type,
                    base_uom_id,
                    tax_id,
                    batch_tracking_required,
                    expiry_tracking_required,
                    shelf_life_days,
                    inventory_valuation_method,
                    standard_cost,
                    last_purchase_cost,
                    minimum_stock_qty,
                    reorder_qty,
                    is_purchase_item,
                    is_manufactured_item,
                    is_sale_item,
                },
                transaction
            );


            /*
            |--------------------------------------------------------------------------
            | Update Type Specific Details
            |--------------------------------------------------------------------------
            */

            if (item_type === "RAW_MATERIAL") {

                if (rawMaterialDetails) {

                    const existingDetails =
                        await RawMaterialDetails.findOne({
                            where: {
                                item_id: item.id,
                            },
                            transaction,
                        });

                    if (existingDetails) {

                        await existingDetails.update(
                            rawMaterialDetails,
                            {
                                transaction,
                            }
                        );

                    } else {

                        await RawMaterialDetails.create(
                            {
                                item_id: item.id,
                                ...rawMaterialDetails,
                            },
                            {
                                transaction,
                            }
                        );
                    }
                }

            } else if (item_type === "PACKAGING_MATERIAL") {

                if (packagingMaterialDetails) {

                    const existingDetails =
                        await PackagingMaterialDetails.findOne({
                            where: {
                                item_id: item.id,
                            },
                            transaction,
                        });

                    if (existingDetails) {

                        await existingDetails.update(
                            packagingMaterialDetails,
                            {
                                transaction,
                            }
                        );

                    } else {

                        await PackagingMaterialDetails.create(
                            {
                                item_id: item.id,
                                ...packagingMaterialDetails,
                            },
                            {
                                transaction,
                            }
                        );
                    }
                }

            } else if (item_type === "FINISHED_PRODUCT") {

                if (finishedProductDetails) {

                    const existingDetails =
                        await FinishedProductDetails.findOne({
                            where: {
                                item_id: item.id,
                            },
                            transaction,
                        });

                    if (existingDetails) {

                        await existingDetails.update(
                            finishedProductDetails,
                            {
                                transaction,
                            }
                        );

                    } else {

                        await FinishedProductDetails.create(
                            {
                                item_id: item.id,
                                ...finishedProductDetails,
                            },
                            {
                                transaction,
                            }
                        );
                    }
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Commit
            |--------------------------------------------------------------------------
            */

            await transaction.commit();

            return res.status(200).json({

                success: true,

                message: "Item updated successfully.",

            });

        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while updating the item.",

            });
        }
    }

    /**
     * Delete Item
     */
    // static async delete(req, res) {

    //     try {

    //         const item = await findById(
    //             req.params.id
    //         );

    //         if (!item) {

    //             return res.status(404).json({

    //                 success: false,

    //                 message: "Item not found.",

    //             });

    //         }

    //         await deleteItem(req.params.id);

    //         return res.status(200).json({

    //             success: true,

    //             message: "Item deleted successfully.",

    //         });

    //     } catch (error) {

    //         return res.status(500).json({

    //             success: false,

    //             message: error.message,

    //         });

    //     }

    // }
    static async delete(req, res) {

    const transaction = await sequelize.transaction();

        try {

            const item = await findById(req.params.id);

            if (!item) {

                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: "Item not found.",
                });
            }


            /*
            |--------------------------------------------------------------------------
            | Delete Type Specific Details
            |--------------------------------------------------------------------------
            */

            await RawMaterialDetails.destroy({
                where: {
                    item_id: item.id,
                },
                transaction,
            });

            await PackagingMaterialDetails.destroy({
                where: {
                    item_id: item.id,
                },
                transaction,
            });

            await FinishedProductDetails.destroy({
                where: {
                    item_id: item.id,
                },
                transaction,
            });


            /*
            |--------------------------------------------------------------------------
            | Delete Main Item
            |--------------------------------------------------------------------------
            */

            await deleteItem(
                req.params.id,
                transaction
            );


            /*
            |--------------------------------------------------------------------------
            | Commit
            |--------------------------------------------------------------------------
            */

            await transaction.commit();

            return res.status(200).json({

                success: true,

                message: "Item deleted successfully.",

            });

        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while deleting the item.",

            });
        }
    }

}

module.exports = ItemController;