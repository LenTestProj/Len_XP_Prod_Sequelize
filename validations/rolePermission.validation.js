const { body, param } = require("express-validator");

const assignPermissionsValidation = [

    /*
    |--------------------------------------------------------------------------
    | Role Id
    |--------------------------------------------------------------------------
    */

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid role id."),

    /*
    |--------------------------------------------------------------------------
    | Permission Ids
    |--------------------------------------------------------------------------
    */

    body("permission_ids")
        .notEmpty()
        .withMessage("Permissions are required.")
        .isArray({ min: 1 })
        .withMessage("atleast one permission is required ."),

    /*
    |--------------------------------------------------------------------------
    | Each Permission Id
    |--------------------------------------------------------------------------
    */

    body("permission_ids.*")
        .isInt({ min: 1 })
        .withMessage("Each permission must be a valid integer."),

    /*
    |--------------------------------------------------------------------------
    | Duplicate Validation
    |--------------------------------------------------------------------------
    */

    body("permission_ids").custom((permissionIds) => {

        const unique = [...new Set(permissionIds)];

        if (unique.length !== permissionIds.length) {

            throw new Error("Duplicate permission are not allowed.");

        }

        return true;

    }),

];

module.exports = {

    assignPermissionsValidation,

};