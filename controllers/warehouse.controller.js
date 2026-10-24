const { Op } = require("sequelize");
const sequelize = require("../config/database");

const {
    createWarehouse,
    findWarehouseById,
    findWarehouseByCode,
    updateWarehouse,
    deleteWarehouse,
    getAllWarehouses,
} = require("../services/warehouse.service");

const {
    Organisation,
    Warehouses,
    WarehouseLocations,
} = require("../models");
const { generateWarehouseCode,generateLocationCode} = require("../helpers/unique.code.helper");

class WarehouseController {


    /*
    |--------------------------------------------------------------------------
    | Create Warehouse + Locations
    |--------------------------------------------------------------------------
    | POST /warehouses
    |--------------------------------------------------------------------------
    */

    static async create(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const {
                organisation_id,
                warehouse_name,
                warehouse_type,
                is_active,
                locations = [],
            } = req.body;

            const warehouse_code = await generateWarehouseCode(
                transaction
            );
            /*
            |--------------------------------------------------------------------------
            | Check Organisation
            |--------------------------------------------------------------------------
            */

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
                    message: "Organisation not found.",
                });

            }


            /*
            |--------------------------------------------------------------------------
            | Check Duplicate Warehouse Code
            |--------------------------------------------------------------------------
            */

            // const existingWarehouse =
            //     await findWarehouseByCode(
            //         warehouse_code.trim(),
            //         transaction
            //     );

            // if (existingWarehouse) {

            //     await transaction.rollback();

            //     return res.status(409).json({
            //         success: false,
            //         message: "Warehouse code already exists.",
            //     });

            // }


            /*
            |--------------------------------------------------------------------------
            | Create Warehouse
            |--------------------------------------------------------------------------
            */

            const warehouse =
                await createWarehouse({

                    organisation_id,

                    warehouse_code,

                    warehouse_name:
                        warehouse_name.trim(),

                    warehouse_type:
                        warehouse_type || "MIXED",

                    is_active:
                        is_active !== undefined
                            ? is_active
                            : true,

                }, transaction);


            /*
            |--------------------------------------------------------------------------
            | Create Locations
            |--------------------------------------------------------------------------
            */

           const createdLocations = [];

            for (const location of locations) {

                const location_code =
                    await generateLocationCode(
                        transaction
                    );

                const createdLocation =
                    await WarehouseLocations.create(
                        {
                            warehouse_id: warehouse.id,

                            location_code,

                            location_name:
                                location.location_name
                                    ? location.location_name.trim()
                                    : null,

                            location_type:
                                location.location_type ||
                                "AVAILABLE",

                            is_active:
                                location.is_active !== undefined
                                    ? location.is_active
                                    : true,
                        },
                        {
                            transaction,
                        }
                    );

                createdLocations.push(createdLocation);
            }

            await transaction.commit();


            return res.status(201).json({

                success: true,

                message:
                    "Warehouse created successfully.",

                data: {

                    ...warehouse.toJSON(),

                    locations:
                        createdLocations.map(
                            location =>
                                location.toJSON()
                        ),

                },

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while creating warehouse.",

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Get All Warehouses + Locations
    |--------------------------------------------------------------------------
    | GET /warehouses
    |--------------------------------------------------------------------------
    */

    static async list(req, res) {

        try {

            let page =
                Number(req.query.page) || 1;

            let limit =
                Number(req.query.limit) || 10;

            page = Math.max(page, 1);

            limit = Math.max(limit, 1);


            const result =
                await getAllWarehouses({

                    page,

                    limit,

                    search:
                        req.query.search,

                    organisation_id:
                        req.query.organisation_id,

                    warehouse_type:
                        req.query.warehouse_type,

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

                message: error.message,

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Get Warehouse By ID + Locations
    |--------------------------------------------------------------------------
    | GET /warehouses/:id
    |--------------------------------------------------------------------------
    */

    static async getById(req, res) {

        try {

            const warehouse =
                await findWarehouseById(
                    req.params.id
                );


            if (!warehouse) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Warehouse not found.",

                });

            }


            return res.status(200).json({

                success: true,

                data: warehouse,

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Update Warehouse + Locations
    |--------------------------------------------------------------------------
    | PUT /warehouses/:id
    |--------------------------------------------------------------------------
    */

    static async update(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const warehouse =
                await findWarehouseById(
                    req.params.id,
                    transaction
                );


            if (!warehouse) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Warehouse not found.",

                });

            }


            const {
                organisation_id,
                warehouse_code,
                warehouse_name,
                warehouse_type,
                is_active,
                locations = [],
            } = req.body;


            /*
            |--------------------------------------------------------------------------
            | Check Organisation
            |--------------------------------------------------------------------------
            */

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


            /*
            |--------------------------------------------------------------------------
            | Check Duplicate Warehouse Code
            |--------------------------------------------------------------------------
            */

            // const existingWarehouse =
            //     await Warehouses.findOne({

            //         where: {

            //             warehouse_code:
            //                 warehouse_code.trim(),

            //             id: {
            //                 [Op.ne]:
            //                     req.params.id,
            //             },

            //         },

            //         transaction,

            //     });


            // if (existingWarehouse) {

            //     await transaction.rollback();

            //     return res.status(409).json({

            //         success: false,

            //         message:
            //             "Warehouse code already exists.",

            //     });

            // }


            /*
            |--------------------------------------------------------------------------
            | Update Warehouse
            |--------------------------------------------------------------------------
            */

            await updateWarehouse(

                req.params.id,

                {

                    organisation_id,

                    warehouse_code:
                        warehouse_code.trim(),

                    warehouse_name:
                        warehouse_name.trim(),

                    warehouse_type,

                    is_active,

                },

                transaction

            );


            /*
            |--------------------------------------------------------------------------
            | Get Existing Locations
            |--------------------------------------------------------------------------
            */

            const existingLocations =
                await WarehouseLocations.findAll({

                    where: {
                        warehouse_id:
                            req.params.id,
                    },

                    transaction,

                });


            const existingLocationMap =
                new Map(
                    existingLocations.map(
                        location => [
                            String(location.id),
                            location,
                        ]
                    )
                );


          

            const requestLocationIds = [];

            for (const location of locations) {

                /*
                |----------------------------------------------------------------------
                | Existing Location
                |----------------------------------------------------------------------
                */

                if (location.id) {

                    const existingLocation =
                        existingLocationMap.get(
                            String(location.id)
                        );

                    if (!existingLocation) {

                        await transaction.rollback();

                        return res.status(404).json({

                            success: false,

                            message:
                                `Location ${location.id} does not belong to this warehouse.`,

                        });

                    }

                    requestLocationIds.push(
                        existingLocation.id
                    );

                    await existingLocation.update({

                        // DO NOT change location_code
                        // It was generated when the location was created.

                        location_name:
                            location.location_name
                                ? location.location_name.trim()
                                : null,

                        location_type:
                            location.location_type ||
                            "AVAILABLE",

                        is_active:
                            location.is_active !== undefined
                                ? location.is_active
                                : true,

                    }, {
                        transaction,
                    });

                }

                /*
                |----------------------------------------------------------------------
                | New Location
                |----------------------------------------------------------------------
                */

                else {

                    const location_code =
                        await generateLocationCode(
                            transaction
                        );

                    const newLocation =
                        await WarehouseLocations.create({

                            warehouse_id:
                                req.params.id,

                            location_code,

                            location_name:
                                location.location_name
                                    ? location.location_name.trim()
                                    : null,

                            location_type:
                                location.location_type ||
                                "AVAILABLE",

                            is_active:
                                location.is_active !== undefined
                                    ? location.is_active
                                    : true,

                        }, {
                            transaction,
                        });

                    requestLocationIds.push(
                        newLocation.id
                    );

                }

            }


            /*
            |--------------------------------------------------------------------------
            | Delete Locations Removed From Request
            |--------------------------------------------------------------------------
            */

            if (requestLocationIds.length > 0) {

                await WarehouseLocations.destroy({

                    where: {

                        warehouse_id:
                            req.params.id,

                        id: {
                            [Op.notIn]:
                                requestLocationIds,
                        },

                    },

                    transaction,

                });

            } else {

                /*
                |------------------------------------------------------------------
                | Empty locations array means delete all locations
                |------------------------------------------------------------------
                */

                await WarehouseLocations.destroy({

                    where: {

                        warehouse_id:
                            req.params.id,

                    },

                    transaction,

                });

            }


            await transaction.commit();


            /*
            |--------------------------------------------------------------------------
            | Return Updated Warehouse
            |--------------------------------------------------------------------------
            */

            const updatedWarehouse =
                await findWarehouseById(
                    req.params.id
                );


            return res.status(200).json({

                success: true,

                message:
                    "Warehouse updated successfully.",

                data:
                    updatedWarehouse,

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while updating warehouse.",

            });

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Delete Warehouse + Locations
    |--------------------------------------------------------------------------
    | DELETE /warehouses/:id
    |--------------------------------------------------------------------------
    */

    static async delete(req, res) {

        const transaction =
            await sequelize.transaction();

        try {

            const warehouse =
                await findWarehouseById(
                    req.params.id,
                    transaction
                );


            if (!warehouse) {

                await transaction.rollback();

                return res.status(404).json({

                    success: false,

                    message:
                        "Warehouse not found.",

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Delete Locations
            |--------------------------------------------------------------------------
            */

            await WarehouseLocations.destroy({

                where: {

                    warehouse_id:
                        warehouse.id,

                },

                transaction,

            });


            /*
            |--------------------------------------------------------------------------
            | Delete Warehouse
            |--------------------------------------------------------------------------
            */

            await deleteWarehouse(

                req.params.id,

                transaction

            );


            await transaction.commit();


            return res.status(200).json({

                success: true,

                message:
                    "Warehouse deleted successfully.",

            });


        } catch (error) {

            console.error(error);

            await transaction.rollback();

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while deleting warehouse.",

            });

        }

    }

}


module.exports = WarehouseController;