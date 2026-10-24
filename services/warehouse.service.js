const { Op } = require("sequelize");

const {
    Warehouses,
    WarehouseLocations,
    Organisation,
} = require("../models");


/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

const createWarehouse = async (
    payload,
    transaction = null
) => {

    return await Warehouses.create(
        payload,
        { transaction }
    );

};


/*
|--------------------------------------------------------------------------
| Find Warehouse By ID
|--------------------------------------------------------------------------
*/

const findWarehouseById = async (
    id,
    transaction = null
) => {

    return await Warehouses.findOne({

        where: {
            id,
        },

        include: [

            {
                model: Organisation,
                as: "organisation",
                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                ],
            },

            {
                model: WarehouseLocations,
                as: "locations",
                required: false,

                // Return only active locations
                where: {
                    is_active: true,
                },

            },

        ],

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Find Warehouse By Code
|--------------------------------------------------------------------------
*/

const findWarehouseByCode = async (
    warehouse_code,
    transaction = null
) => {

    return await Warehouses.findOne({

        where: {
            warehouse_code,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/

const updateWarehouse = async (
    id,
    data,
    transaction = null
) => {

    return await Warehouses.update(

        data,

        {
            where: {
                id,
            },

            transaction,
        }

    );

};


/*
|--------------------------------------------------------------------------
| Delete Warehouse
|--------------------------------------------------------------------------
*/

const deleteWarehouse = async (
    id,
    transaction = null
) => {

    return await Warehouses.destroy({

        where: {
            id,
        },

        transaction,

    });

};


/*
|--------------------------------------------------------------------------
| Get All Warehouses
|--------------------------------------------------------------------------
*/

const getAllWarehouses = async ({
    page = 1,
    limit = 10,
    search = "",
    organisation_id,
    warehouse_type,
}) => {

    const offset =
        (page - 1) * limit;

    const where = {};

    if (organisation_id) {

        where.organisation_id =
            organisation_id;

    }

    if (warehouse_type) {

        where.warehouse_type =
            warehouse_type;

    }

    if (search) {

        where[Op.or] = [

            {
                warehouse_code: {
                    [Op.like]: `%${search}%`,
                },
            },

            {
                warehouse_name: {
                    [Op.like]: `%${search}%`,
                },
            },

        ];

    }

    return await Warehouses.findAndCountAll({

        where,

        include: [

            {
                model: Organisation,
                as: "organisation",
                attributes: [
                    "id",
                    "organisation_code",
                    "organisation_name",
                ],
            },

            {
                model: WarehouseLocations,
                as: "locations",
                required: false,

                where: {
                    is_active: true,
                },

            },

        ],

        offset,
        limit,

        distinct: true,

        order: [
            ["id", "DESC"],
        ],

    });

};


module.exports = {

    createWarehouse,
    findWarehouseById,
    findWarehouseByCode,
    updateWarehouse,
    deleteWarehouse,
    getAllWarehouses,

};