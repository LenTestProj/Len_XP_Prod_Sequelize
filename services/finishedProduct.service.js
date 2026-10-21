const {Op} = require("sequelize");

const {FinishedProductDetails,Items,Units} = require("../models");

//create finished product
const createFinishedProduct = async(payload) => {
    return await FinishedProductDetails.create(payload);
}

//find finished product by item Id
const findByItemId = async(itemId) => {
    return await FinishedProductDetails.findOne({
        where:{
            item_id:itemId
        },
        include:[
            {
                model:Items,
                as:"item"
            },
            {
                model:Units,
                as:"netContentUom",
                attributes:[
                    "id",
                    "uom_code",
                    "uom_name"
                ]
            }
        ]
    })
};

/**
 * Check Existing Finished Product
 */
const exists = async (itemId) => {

    return await FinishedProductDetails.findOne({

        where: {
            item_id: itemId,
        },

    });

};

/**
 * Update Finished Product
 */
const updateFinishedProduct = async (
    itemId,
    payload
) => {
    return await FinishedProductDetails.update(
        payload,
        {
            where:{
                item_id:itemId
            }
        }
    );
};

const deleteFinishedProduct = async(itemId) => {
    return await FinishedProductDetails.destroy({
        where:{
            item_id:itemId
        }
    })
}

const listFinishedProducts = async({
    page=1,
    limit=10,
    search=""
}) => {
    const offset = (page - 1)*size;
    return await FinishedProductDetails.findAndCountAll({
        include:[
            {
                model:Items,
                as:"item",
                where:{
                    item_type:"FINISHED_PRODUCT",
                    ...(search
                        ? {
                            [Op.or]:[
                                {
                                    item_code: {
                                        [Op.like]:`%${search}%`
                                    }
                                },
                                {
                                    item_name:{
                                        [Op.like]:`%${search}%`
                                    }
                                }
                            ]
                        }
                        :{}
                    )
                }
            },
            {
                model:Units,
                as: "netContentUom",
                attributes: [
                    "id",
                    "uom_code",
                    "uom_name"
                ]
            }
        ],
        offset,
        limit,
        order:[
            ["item_id", "DESC"]
        ]
    })
};

moddule.exports = {
    createFinishedProduct,
    findByItemId,
    exists,

    updateFinishedProduct,

    deleteFinishedProduct,

    listFinishedProducts,
}