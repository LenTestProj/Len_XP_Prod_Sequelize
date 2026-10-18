const { body } = require("express-validator");

const createWarehouseValidation = [

    /*
    |--------------------------------------------------------------------------
    | Organisation
    |--------------------------------------------------------------------------
    */

    body("organisation_id")
        .custom((value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error(
                    "Organisation is required."
                );
            }

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Organisation must be a valid ID."
                );
            }

            return true;
        }),


    /*
    |--------------------------------------------------------------------------
    | Warehouse Name
    |--------------------------------------------------------------------------
    */

    body("warehouse_name")
        .exists({ checkFalsy: true })
        .withMessage(
            "Warehouse name is required."
        )
        .bail()
        .isString()
        .withMessage(
            "Warehouse name must be a string."
        )
        .bail()
        .trim()
        .notEmpty()
        .withMessage(
            "Warehouse name is required."
        )
        .bail()
        .isLength({
            min: 2,
            max: 150,
        })
        .withMessage(
            "Warehouse name must be between 2 and 150 characters."
        ),


    /*
    |--------------------------------------------------------------------------
    | Warehouse Type
    |--------------------------------------------------------------------------
    */

    body("warehouse_type")
        .optional()
        .isIn([
            "RAW_MATERIAL",
            "PACKAGING",
            "FINISHED_GOODS",
            "MIXED",
            "PRODUCTION",
        ])
        .withMessage(
            "Invalid warehouse type."
        ),


    /*
    |--------------------------------------------------------------------------
    | Active
    |--------------------------------------------------------------------------
    */

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Status must be a boolean."
        ),


    /*
    |--------------------------------------------------------------------------
    | Locations
    |--------------------------------------------------------------------------
    */

    body("locations")
        .optional()
        .isArray()
        .withMessage(
            "Locations must be an array."
        ),


    /*
    |--------------------------------------------------------------------------
    | Location Name
    |--------------------------------------------------------------------------
    */

    body("locations.*.location_name")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Location name must be a string."
        )
        .isLength({
            max: 150,
        })
        .withMessage(
            "Location name cannot exceed 150 characters."
        ),


    /*
    |--------------------------------------------------------------------------
    | Location Type
    |--------------------------------------------------------------------------
    */

    body("locations.*.location_type")
        .optional()
        .isIn([
            "RECEIVING",
            "QUARANTINE",
            "AVAILABLE",
            "REJECTED",
            "PRODUCTION",
            "DISPATCH",
        ])
        .withMessage(
            "Invalid location type."
        ),


    /*
    |--------------------------------------------------------------------------
    | Location Active
    |--------------------------------------------------------------------------
    */

    body("locations.*.is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Location Status must be a boolean."
        ),

];


/*
|--------------------------------------------------------------------------
| Update Validation
|--------------------------------------------------------------------------
*/

const updateWarehouseValidation = [

    /*
    |--------------------------------------------------------------------------
    | Organisation
    |--------------------------------------------------------------------------
    */

    body("organisation_id")
        .custom((value) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                throw new Error(
                    "Organisation is required."
                );
            }

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Organisation must be a valid ID."
                );
            }

            return true;
        }),


    /*
    |--------------------------------------------------------------------------
    | Warehouse Name
    |--------------------------------------------------------------------------
    */

    body("warehouse_name")
        .exists({ checkFalsy: true })
        .withMessage(
            "Warehouse name is required."
        )
        .bail()
        .isString()
        .withMessage(
            "Warehouse name must be a string."
        )
        .bail()
        .trim()
        .notEmpty()
        .withMessage(
            "Warehouse name is required."
        )
        .bail()
        .isLength({
            min: 2,
            max: 150,
        })
        .withMessage(
            "Warehouse name must be between 2 and 150 characters."
        ),


    /*
    |--------------------------------------------------------------------------
    | Warehouse Type
    |--------------------------------------------------------------------------
    */

    body("warehouse_type")
        .optional()
        .isIn([
            "RAW_MATERIAL",
            "PACKAGING",
            "FINISHED_GOODS",
            "MIXED",
            "PRODUCTION",
        ])
        .withMessage(
            "Invalid warehouse type."
        ),


    /*
    |--------------------------------------------------------------------------
    | Active
    |--------------------------------------------------------------------------
    */

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Status must be a boolean."
        ),


    /*
    |--------------------------------------------------------------------------
    | Locations
    |--------------------------------------------------------------------------
    */

    body("locations")
        .optional()
        .isArray()
        .withMessage(
            "Locations must be an array."
        ),

    /*
    |--------------------------------------------------------------------------
    | Location Name
    |--------------------------------------------------------------------------
    */

    body("locations.*.location_name")
        .optional({
            nullable: true,
        })
        .isString()
        .withMessage(
            "Location name must be a string."
        )
        .isLength({
            max: 150,
        })
        .withMessage(
            "Location name cannot exceed 150 characters."
        ),


    /*
    |--------------------------------------------------------------------------
    | Location Type
    |--------------------------------------------------------------------------
    */

    body("locations.*.location_type")
        .optional()
        .isIn([
            "RECEIVING",
            "QUARANTINE",
            "AVAILABLE",
            "REJECTED",
            "PRODUCTION",
            "DISPATCH",
        ])
        .withMessage(
            "Invalid location type."
        ),


    /*
    |--------------------------------------------------------------------------
    | Location Active
    |--------------------------------------------------------------------------
    */

    body("locations.*.is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Location Status must be a boolean."
        ),
    body("locations.*.id")
        .optional()
        .custom((value) => {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 1
            ) {
                throw new Error(
                    "Location ID must be a valid ID."
                );
            }

            return true;
        }),

];


module.exports = {
    createWarehouseValidation,
    updateWarehouseValidation,
};