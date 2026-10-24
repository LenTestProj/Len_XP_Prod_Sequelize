const { Op } = require("sequelize");

const sequelize = require("../config/database");

const {
    Formulations,
    FormulationVersions,
    FormulationLines,
    Items,
    Units,
    Organisation,
} = require("../models");


/*
|--------------------------------------------------------------------------
| CREATE FORMULATION
|--------------------------------------------------------------------------
| Creates:
| 1. Formulation
| 2. Version 1
| 3. Formulation Lines
|
| Everything happens inside one transaction.
|--------------------------------------------------------------------------
*/

// const createFormulation = async ({
//     formulation,
//     version,
//     lines = [],
// }) => {

//     const transaction = await sequelize.transaction();

//     try {

//         /*
//         |--------------------------------------------------------------------------
//         | Validate Organisation
//         |--------------------------------------------------------------------------
//         */

//         const organisation = await Organisation.findByPk(
//             formulation.organisation_id,
//             {
//                 transaction,
//             }
//         );

//         if (!organisation) {
//             throw new Error("Organisation not found.");
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Validate Finished Product
//         |--------------------------------------------------------------------------
//         */

//         const finishedProduct = await Items.findOne({
//             where: {
//                 id: formulation.finished_product_item_id,
//                 organisation_id: formulation.organisation_id,
//             },
//             transaction,
//         });

//         if (!finishedProduct) {
//             throw new Error(
//                 "Finished product item not found."
//             );
//         }

//         if (finishedProduct.item_type !== "FINISHED_PRODUCT") {
//             throw new Error(
//                 "Selected item is not a Finished Product."
//             );
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Check Formulation Code
//         |--------------------------------------------------------------------------
//         */

//         const existingFormulation =
//             await Formulations.findOne({
//                 where: {
//                     organisation_id:
//                         formulation.organisation_id,

//                     formulation_code:
//                         formulation.formulation_code,
//                 },

//                 transaction,
//             });

//         if (existingFormulation) {
//             throw new Error(
//                 "Formulation code already exists."
//             );
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Create Formulation
//         |--------------------------------------------------------------------------
//         */

//         const createdFormulation =
//             await Formulations.create(
//                 formulation,
//                 {
//                     transaction,
//                 }
//             );


//         /*
//         |--------------------------------------------------------------------------
//         | Create Version 1
//         |--------------------------------------------------------------------------
//         */

//         const createdVersion =
//             await FormulationVersions.create(
//                 {
//                     formulation_id:
//                         createdFormulation.id,

//                     version_no: 1,

//                     status: "DRAFT",

//                     ...version,
//                 },
//                 {
//                     transaction,
//                 }
//             );


//         /*
//         |--------------------------------------------------------------------------
//         | Validate Duplicate Line Numbers
//         |--------------------------------------------------------------------------
//         */

//         if (lines.length > 0) {

//             const lineNumbers = lines.map(
//                 line => Number(line.line_no)
//             );

//             if (
//                 new Set(lineNumbers).size !==
//                 lineNumbers.length
//             ) {
//                 throw new Error(
//                     "Duplicate line_no found."
//                 );
//             }


//             /*
//             |--------------------------------------------------------------------------
//             | Validate Component Items
//             |--------------------------------------------------------------------------
//             */

//             const componentItemIds = [
//                 ...new Set(
//                     lines.map(
//                         line =>
//                             Number(
//                                 line.component_item_id
//                             )
//                     )
//                 ),
//             ];

//             const componentItems =
//                 await Items.findAll({

//                     where: {
//                         id: {
//                             [Op.in]:
//                                 componentItemIds,
//                         },

//                         organisation_id:
//                             formulation.organisation_id,
//                     },

//                     transaction,
//                 });


//             if (
//                 componentItems.length !==
//                 componentItemIds.length
//             ) {
//                 throw new Error(
//                     "One or more component items not found."
//                 );
//             }


//             /*
//             |--------------------------------------------------------------------------
//             | Validate UOMs
//             |--------------------------------------------------------------------------
//             */

//             const uomIds = [
//                 ...new Set(
//                     lines.map(
//                         line =>
//                             Number(
//                                 line.required_uom_id
//                             )
//                     )
//                 ),
//             ];

//             const uoms =
//                 await Units.findAll({

//                     where: {
//                         id: {
//                             [Op.in]: uomIds,
//                         },
//                     },

//                     transaction,
//                 });


//             if (
//                 uoms.length !==
//                 uomIds.length
//             ) {
//                 throw new Error(
//                     "One or more required UOMs not found."
//                 );
//             }


//             /*
//             |--------------------------------------------------------------------------
//             | Create Lines
//             |--------------------------------------------------------------------------
//             */

//             const formulationLines =
//                 lines.map(line => ({

//                     formulation_version_id:
//                         createdVersion.id,

//                     line_no:
//                         line.line_no,

//                     component_item_id:
//                         line.component_item_id,

//                     component_role:
//                         line.component_role,

//                     production_stage:
//                         line.production_stage ||
//                         null,

//                     calculation_method:
//                         line.calculation_method ||
//                         "PER_OUTPUT_QTY",

//                     required_qty:
//                         line.required_qty,

//                     required_uom_id:
//                         line.required_uom_id,

//                     basis_output_qty:
//                         line.basis_output_qty ??
//                         null,

//                     pack_capacity:
//                         line.pack_capacity ??
//                         null,

//                     process_wastage_percent:
//                         line.process_wastage_percent ??
//                         0,

//                     rounding_method:
//                         line.rounding_method ||
//                         "NONE",

//                     rounding_multiple:
//                         line.rounding_multiple ??
//                         null,

//                     sequence_no:
//                         line.sequence_no ??
//                         1,

//                     is_optional:
//                         line.is_optional ??
//                         false,

//                     notes:
//                         line.notes ||
//                         null,
//                 }));


//             await FormulationLines.bulkCreate(
//                 formulationLines,
//                 {
//                     transaction,
//                 }
//             );
//         }


//         /*
//         |--------------------------------------------------------------------------
//         | Commit
//         |--------------------------------------------------------------------------
//         */

//         await transaction.commit();


//         /*
//         |--------------------------------------------------------------------------
//         | Return Complete Formulation
//         |--------------------------------------------------------------------------
//         */

//         return await findById(
//             createdFormulation.id
//         );

//     } catch (error) {

//         await transaction.rollback();

//         throw error;
//     }
// };
const createFormulation = async ({
    formulation,
    version,
    lines = [],
}) => {

    const transaction = await sequelize.transaction();

    try {

        const organisation = await Organisation.findByPk(
            formulation.organisation_id,
            {
                transaction,
            }
        );

        if (!organisation) {
            throw new Error("Organisation not found.");
        }

        const finishedProduct = await Items.findOne({
            where: {
                id: formulation.finished_product_item_id,
                organisation_id: formulation.organisation_id,
            },
            transaction,
        });

        if (!finishedProduct) {
            throw new Error(
                "Finished product item not found."
            );
        }

        if (
            finishedProduct.item_type !==
            "FINISHED_PRODUCT"
        ) {
            throw new Error(
                "Selected item is not a Finished Product."
            );
        }

        const existingFormulation =
            await Formulations.findOne({
                where: {
                    organisation_id:
                        formulation.organisation_id,

                    formulation_code:
                        formulation.formulation_code,
                },
                transaction,
            });

        if (existingFormulation) {
            throw new Error(
                "Formulation code already exists."
            );
        }

        if (!Array.isArray(lines)) {
            throw new Error(
                "Formulation lines must be an array."
            );
        }


        if (lines.length > 0) {

            const lineNumbers = lines.map(
                line => Number(line.line_no)
            );

            if (
                new Set(lineNumbers).size !==
                lineNumbers.length
            ) {
                throw new Error(
                    "Duplicate line_no found."
                );
            }

            const componentItemIds = [
                ...new Set(
                    lines.map(
                        line =>
                            Number(
                                line.component_item_id
                            )
                    )
                ),
            ];

            const componentItems =
                await Items.findAll({
                    where: {
                        id: {
                            [Op.in]: componentItemIds,
                        },

                        organisation_id:
                            formulation.organisation_id,
                    },

                    transaction,
                });


            if (
                componentItems.length !==
                componentItemIds.length
            ) {
                throw new Error(
                    "One or more component items not found."
                );
            }

            const finishedProductId =
                Number(
                    formulation.finished_product_item_id
                );

            const isFinishedProductUsed =
                componentItemIds.includes(
                    finishedProductId
                );

            if (isFinishedProductUsed) {
                throw new Error(
                    "Finished product cannot be used as a formulation component."
                );
            }

            const uomIds = [
                ...new Set(
                    lines.map(
                        line =>
                            Number(
                                line.required_uom_id
                            )
                    )
                ),
            ];

            const uoms =
                await Units.findAll({
                    where: {
                        id: {
                            [Op.in]: uomIds,
                        },
                    },

                    transaction,
                });


            if (
                uoms.length !==
                uomIds.length
            ) {
                throw new Error(
                    "One or more required UOMs not found."
                );
            }

        }

        const createdFormulation =
            await Formulations.create(
                {
                    organisation_id:
                        formulation.organisation_id,

                    finished_product_item_id:
                        formulation.finished_product_item_id,

                    formulation_code:
                        formulation.formulation_code,

                    formulation_name:
                        formulation.formulation_name,

                    formulation_type:
                        formulation.formulation_type ||
                        "MANUFACTURING",

                    is_active:
                        formulation.is_active ??
                        true,
                },
                {
                    transaction,
                }
            );

        const createdVersion =
            await FormulationVersions.create(
                {
                    formulation_id:
                        createdFormulation.id,

                    version_no: 1,

                    status: "DRAFT",

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
                {
                    transaction,
                }
            );

        if (lines.length > 0) {

            const formulationLines =
                lines.map(line => ({

                    formulation_version_id:
                        createdVersion.id,

                    line_no:
                        Number(line.line_no),

                    component_item_id:
                        Number(
                            line.component_item_id
                        ),

                    component_role:
                        line.component_role,

                    production_stage:
                        line.production_stage ||
                        null,

                    calculation_method:
                        line.calculation_method ||
                        "PER_OUTPUT_QTY",

                    required_qty:
                        line.required_qty,

                    required_uom_id:
                        Number(
                            line.required_uom_id
                        ),

                    basis_output_qty:
                        line.basis_output_qty ??
                        null,

                    pack_capacity:
                        line.pack_capacity ??
                        null,

                    process_wastage_percent:
                        line.process_wastage_percent ??
                        0,

                    rounding_method:
                        line.rounding_method ||
                        "NONE",

                    rounding_multiple:
                        line.rounding_multiple ??
                        null,

                    sequence_no:
                        line.sequence_no ??
                        1,

                    is_optional:
                        line.is_optional ??
                        false,

                    notes:
                        line.notes ||
                        null,
                }));


            await FormulationLines.bulkCreate(
                formulationLines,
                {
                    transaction,
                }
            );
        }
        await transaction.commit();

        return {
            formulation: createdFormulation,
            version: createdVersion,
        };


    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| FIND FORMULATION BY ID
|--------------------------------------------------------------------------
*/

const findById = async (id) => {

    return await Formulations.findOne({

        where: {
            id,
        },

        include: [

            {
                model: Organisation,
                as: "organisation",

                attributes: [
                    "id",
                    "organisation_name",
                ],
            },

            {
                model: Items,
                as: "finishedProduct",

                attributes: [
                    "id",
                    "item_code",
                    "item_name",
                    "item_type",
                ],
            },

            {
                model: FormulationVersions,
                as: "versions",

                include: [

                    {
                        model: Units,
                        as: "outputUom",

                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },

                    {
                        model: FormulationLines,
                        as: "lines",

                        include: [

                            {
                                model: Items,
                                as: "componentItem",

                                attributes: [
                                    "id",
                                    "item_code",
                                    "item_name",
                                    "item_type",
                                ],
                            },

                            {
                                model: Units,
                                as: "requiredUom",

                                attributes: [
                                    "id",
                                    "code",
                                    "name",
                                ],
                            },

                        ],
                    },

                ],
            },

        ],

        order: [
            [
                {
                    model: FormulationVersions,
                    as: "versions",
                },
                "version_no",
                "DESC",
            ],
        ],

    });

};


/*
|--------------------------------------------------------------------------
| EXISTS BY CODE
|--------------------------------------------------------------------------
*/

const existsByCode = async (
    organisationId,
    formulationCode
) => {

    return await Formulations.findOne({

        where: {
            organisation_id: organisationId,

            formulation_code:
                formulationCode,
        },

    });

};




const listFormulations = async ({
    organisation_id,
    page = 1,
    limit = 10,
    search = "",
    formulation_type,
    is_active,
}) => {

    const offset =
        (Number(page) - 1) *
        Number(limit);

    const where = {
        organisation_id,
    };


    if (formulation_type) {

        where.formulation_type =
            formulation_type;

    }


    if (is_active !== undefined) {

        where.is_active =
            is_active;

    }


    if (search) {

        where[Op.or] = [

            {
                formulation_code: {
                    [Op.like]:
                        `%${search}%`,
                },
            },

            {
                formulation_name: {
                    [Op.like]:
                        `%${search}%`,
                },
            },

        ];

    }


    return await Formulations.findAndCountAll({

        where,

        include: [

            {
                model: Items,
                as: "finishedProduct",

                attributes: [
                    "id",
                    "item_code",
                    "item_name",
                    "item_type",
                ],
            },

        ],

        offset,

        limit: Number(limit),

        order: [
            ["id", "DESC"],
        ],

    });

};


/*
|--------------------------------------------------------------------------
| LIST VERSIONS
|--------------------------------------------------------------------------
*/

const listVersions = async (formulationId) => {

    return await FormulationVersions.findAll({

        where: {
            formulation_id: formulationId,
        },

        include: [

            // Output UOM
            {
                model: Units,
                as: "outputUom",

                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },

            // Formulation Lines
            {
                model: FormulationLines,
                as: "lines",

                include: [

                    // Component Item
                    {
                        model: Items,
                        as: "componentItem",

                        attributes: [
                            "id",
                            "item_code",
                            "item_name",
                            "item_type",
                        ],
                    },

                    // Required UOM
                    {
                        model: Units,
                        as: "requiredUom",

                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },

                ],
            },

        ],

        order: [
            ["version_no", "DESC"],
        ],

    });
};


/*
|--------------------------------------------------------------------------
| FIND VERSION
|--------------------------------------------------------------------------
*/

const findVersion = async (
    formulationId,
    versionId
) => {

    return await FormulationVersions.findOne({

        where: {

            id: versionId,

            formulation_id:
                formulationId,
        },

        include: [

            {
                model: Units,
                as: "outputUom",

                attributes: [
                    "id",
                    "code",
                    "name",
                ],
            },

            {
                model: FormulationLines,
                as: "lines",

                include: [

                    {
                        model: Items,
                        as: "componentItem",

                        attributes: [
                            "id",
                            "item_code",
                            "item_name",
                            "item_type",
                        ],
                    },

                    {
                        model: Units,
                        as: "requiredUom",

                        attributes: [
                            "id",
                            "code",
                            "name",
                        ],
                    },

                ],

            },

        ],

        order: [

            [
                {
                    model: FormulationLines,
                    as: "lines",
                },

                "line_no",

                "ASC",
            ],

        ],

    });

};


/*
|--------------------------------------------------------------------------
| CREATE VERSION
|--------------------------------------------------------------------------
*/

const createVersion = async ({
    formulationId,
    version,
    lines = [],
}) => {

    const transaction =
        await sequelize.transaction();

    try {

        const formulation =
            await Formulations.findByPk(
                formulationId,
                {
                    transaction,
                }
            );

        if (!formulation) {
            throw new Error(
                "Formulation not found."
            );
        }


        const latestVersion =
            await FormulationVersions.findOne({

                where: {
                    formulation_id:
                        formulationId,
                },

                order: [
                    ["version_no", "DESC"],
                ],

                transaction,
            });


        const nextVersionNo =
            latestVersion
                ? Number(
                    latestVersion.version_no
                ) + 1
                : 1;


        const createdVersion =
            await FormulationVersions.create({

                formulation_id:
                    formulationId,

                version_no:
                    nextVersionNo,

                status: "DRAFT",

                ...version,

            }, {
                transaction,
            });


        if (lines.length > 0) {

            const lineNumbers =
                lines.map(
                    line =>
                        Number(line.line_no)
                );

            if (
                new Set(lineNumbers).size !==
                lineNumbers.length
            ) {
                throw new Error(
                    "Duplicate line_no found."
                );
            }


            const formulationLines =
                lines.map(line => ({

                    formulation_version_id:
                        createdVersion.id,

                    ...line,

                }));


            await FormulationLines.bulkCreate(
                formulationLines,
                {
                    transaction,
                }
            );
        }


        await transaction.commit();


        return await findVersion(
            formulationId,
            createdVersion.id
        );

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


/*
|--------------------------------------------------------------------------
| UPDATE DRAFT VERSION
|--------------------------------------------------------------------------
*/

const updateVersion = async (
    formulationId,
    versionId,
    versionPayload,
    lines
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const version =
            await FormulationVersions.findOne({

                where: {

                    id: versionId,

                    formulation_id:
                        formulationId,
                },

                transaction,

            });


        if (!version) {
            throw new Error(
                "Formulation version not found."
            );
        }


        if (
            version.status !== "DRAFT"
        ) {
            throw new Error(
                "Only draft formulation versions can be updated."
            );
        }


        await version.update(
            versionPayload,
            {
                transaction,
            }
        );


        if (Array.isArray(lines)) {

            await FormulationLines.destroy({

                where: {
                    formulation_version_id:
                        versionId,
                },

                transaction,

            });


            if (lines.length > 0) {

                const lineNumbers =
                    lines.map(
                        line =>
                            Number(line.line_no)
                    );

                if (
                    new Set(lineNumbers).size !==
                    lineNumbers.length
                ) {
                    throw new Error(
                        "Duplicate line_no found."
                    );
                }


                const formulationLines =
                    lines.map(line => ({

                        formulation_version_id:
                            versionId,

                        ...line,

                    }));


                await FormulationLines.bulkCreate(
                    formulationLines,
                    {
                        transaction,
                    }
                );
            }
        }


        await transaction.commit();


        return await findVersion(
            formulationId,
            versionId
        );

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


/*
|--------------------------------------------------------------------------
| APPROVE VERSION
|--------------------------------------------------------------------------
*/

const approveVersion = async ({
    formulationId,
    versionId,
    approvedBy,
}) => {

    const transaction =
        await sequelize.transaction();

    try {

        const version =
            await FormulationVersions.findOne({

                where: {

                    id: versionId,

                    formulation_id:
                        formulationId,
                },

                include: [
                    {
                        model:
                            FormulationLines,

                        as: "lines",
                    },
                ],

                transaction,

            });


        if (!version) {
            throw new Error(
                "Formulation version not found."
            );
        }


        if (
            version.status !== "DRAFT"
        ) {
            throw new Error(
                "Only draft formulation versions can be approved."
            );
        }


        if (
            !version.lines ||
            version.lines.length === 0
        ) {
            throw new Error(
                "Formulation version must contain at least one component."
            );
        }


        const currentApproved =
            await FormulationVersions.findOne({

                where: {

                    formulation_id:
                        formulationId,

                    status: "APPROVED",
                },

                transaction,

            });


        if (currentApproved) {

            await currentApproved.update({

                status: "OBSOLETE",

                effective_to:
                    new Date(),

            }, {
                transaction,
            });
        }


        await version.update({

            status: "APPROVED",

            approved_at:
                new Date(),

            approved_by:
                approvedBy || null,

        }, {
            transaction,
        });


        await transaction.commit();


        return await findVersion(
            formulationId,
            versionId
        );

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


/*
|--------------------------------------------------------------------------
| OBSOLETE VERSION
|--------------------------------------------------------------------------
*/

const obsoleteVersion = async (
    formulationId,
    versionId
) => {

    const version =
        await FormulationVersions.findOne({

            where: {

                id: versionId,

                formulation_id:
                    formulationId,
            },

        });


    if (!version) {
        throw new Error(
            "Formulation version not found."
        );
    }


    if (
        version.status === "OBSOLETE"
    ) {
        throw new Error(
            "Formulation version is already obsolete."
        );
    }


    await version.update({

        status: "OBSOLETE",

        effective_to:
            new Date(),

    });


    return version;
};


/*
|--------------------------------------------------------------------------
| DELETE DRAFT VERSION
|--------------------------------------------------------------------------
*/

const deleteVersion = async (
    formulationId,
    versionId
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const version =
            await FormulationVersions.findOne({

                where: {

                    id: versionId,

                    formulation_id:
                        formulationId,
                },

                transaction,

            });


        if (!version) {
            throw new Error(
                "Formulation version not found."
            );
        }


        if (
            version.status !== "DRAFT"
        ) {
            throw new Error(
                "Only draft formulation versions can be deleted."
            );
        }


        await FormulationLines.destroy({

            where: {
                formulation_version_id:
                    versionId,
            },

            transaction,

        });


        await version.destroy({
            transaction,
        });


        await transaction.commit();


        return true;

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


/*
|--------------------------------------------------------------------------
| ADD LINE
|--------------------------------------------------------------------------
*/

const addLine = async (
    formulationId,
    versionId,
    payload
) => {

    const version =
        await FormulationVersions.findOne({

            where: {

                id: versionId,

                formulation_id:
                    formulationId,
            },

        });


    if (!version) {
        throw new Error(
            "Formulation version not found."
        );
    }


    if (
        version.status !== "DRAFT"
    ) {
        throw new Error(
            "Lines can only be added to draft versions."
        );
    }


    const existingLine =
        await FormulationLines.findOne({

            where: {

                formulation_version_id:
                    versionId,

                line_no:
                    payload.line_no,
            },

        });


    if (existingLine) {
        throw new Error(
            "Line number already exists."
        );
    }


    return await FormulationLines.create({

        formulation_version_id:
            versionId,

        ...payload,

    });

};


/*
|--------------------------------------------------------------------------
| UPDATE LINE
|--------------------------------------------------------------------------
*/

const updateLine = async (
    formulationId,
    versionId,
    lineId,
    payload
) => {

    const version =
        await FormulationVersions.findOne({

            where: {

                id: versionId,

                formulation_id:
                    formulationId,
            },

        });


    if (!version) {
        throw new Error(
            "Formulation version not found."
        );
    }


    if (
        version.status !== "DRAFT"
    ) {
        throw new Error(
            "Only draft versions can be modified."
        );
    }


    const line =
        await FormulationLines.findOne({

            where: {

                id: lineId,

                formulation_version_id:
                    versionId,
            },

        });


    if (!line) {
        throw new Error(
            "Formulation line not found."
        );
    }


    await line.update(payload);


    return line;
};


/*
|--------------------------------------------------------------------------
| DELETE LINE
|--------------------------------------------------------------------------
*/

const deleteLine = async (
    formulationId,
    versionId,
    lineId
) => {

    const version =
        await FormulationVersions.findOne({

            where: {

                id: versionId,

                formulation_id:
                    formulationId,
            },

        });


    if (!version) {
        throw new Error(
            "Formulation version not found."
        );
    }


    if (
        version.status !== "DRAFT"
    ) {
        throw new Error(
            "Only draft versions can be modified."
        );
    }


    const line =
        await FormulationLines.findOne({

            where: {

                id: lineId,

                formulation_version_id:
                    versionId,
            },

        });


    if (!line) {
        throw new Error(
            "Formulation line not found."
        );
    }


    await line.destroy();


    return true;
};


module.exports = {

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

};