const { body } = require("express-validator");

/**
 * Create Organisation Validation
 */
const createOrganisationValidation = [

    body("organisation_name")
        .trim()
        .notEmpty()
        .withMessage("Organisation name is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage("Organisation name must be between 2 and 150 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("base_currency")
        .trim()
        .notEmpty()
        .withMessage("Base currency is required.")
        .isLength({ min: 3, max: 3 })
        .withMessage("Base currency must be exactly 3 characters.")
        .isAlpha()
        .withMessage("Base currency must contain only alphabets."),

    body("is_active")
        .optional()
        // .customSanitizer((value) => value.toLowerCase())
        .isIn([true, false])
        .withMessage("Status must be true or false."),

];

/**
 * Update Organisation Validation
 */
const updateOrganisationValidation = [

    body("organisation_name")
        .trim()
        .notEmpty()
        .withMessage("Organisation name is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage("Organisation name must be between 2 and 150 characters."),
        // .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
        // .withMessage(
        //     "Name can contain only letters, spaces, dots, apostrophes and hyphens."
        // ),

    body("base_currency")
        .trim()
        .notEmpty()
        .withMessage("Base currency is required.")
        .isLength({ min: 3, max: 3 })
        .withMessage("Base currency must be exactly 3 characters.")
        .isAlpha()
        .withMessage("Base currency must contain only alphabets."),

    body("is_active")
        .optional()
        .isIn([true, false])
        .withMessage("Status must be true or false."),


];

module.exports = {

    createOrganisationValidation,

    updateOrganisationValidation,

};