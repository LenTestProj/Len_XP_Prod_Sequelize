const { body, param } = require("express-validator");


/*
|--------------------------------------------------------------------------
| Common Formulation Line Validation
|--------------------------------------------------------------------------
*/

const formulationLineValidation = [

    body("lines")
        .isArray({ min: 1 })
        .withMessage(
            "At least one formulation line is required."
        ),

    body("lines.*.line_no")
        .notEmpty()
        .withMessage(
            "Line number is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Line number must be a valid positive integer."
        ),

    body("lines.*.component_item_id")
        .notEmpty()
        .withMessage(
            "Component item is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid component item."
        ),

    body("lines.*.component_role")
        .notEmpty()
        .withMessage(
            "Component role is required."
        )
        .isIn([
            "RAW_MATERIAL",
            "PRIMARY_PACKAGING",
            "SECONDARY_PACKAGING",
            "TERTIARY_PACKAGING",
            "SEMI_FINISHED_COMPONENT",
        ])
        .withMessage(
            "Invalid component role."
        ),

    body("lines.*.production_stage")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Production stage must not exceed 100 characters."
        ),

    body("lines.*.calculation_method")
        .optional()
        .isIn([
            "PER_OUTPUT_QTY",
            "FIXED_PER_BATCH",
            "ROUND_UP_BY_CAPACITY",
            "PERCENTAGE",
            "MANUAL",
        ])
        .withMessage(
            "Invalid calculation method."
        ),

    body("lines.*.required_qty")
        .notEmpty()
        .withMessage(
            "Required quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Required quantity must be greater than or equal to 0."
        ),

    body("lines.*.required_uom_id")
        .notEmpty()
        .withMessage(
            "Required UOM is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid required UOM."
        ),

    body("lines.*.basis_output_qty")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Basis output quantity must be greater than or equal to 0."
        ),

    body("lines.*.pack_capacity")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Pack capacity must be greater than or equal to 0."
        ),

    body("lines.*.process_wastage_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Process wastage percentage must be between 0 and 100."
        ),

    body("lines.*.rounding_method")
        .optional()
        .isIn([
            "NONE",
            "CEIL",
            "FLOOR",
            "NEAREST",
        ])
        .withMessage(
            "Invalid rounding method."
        ),

    body("lines.*.rounding_multiple")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Rounding multiple must be greater than or equal to 0."
        ),

    body("lines.*.sequence_no")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Sequence number must be a positive integer."
        ),

    body("lines.*.is_optional")
        .optional()
        .isBoolean()
        .withMessage(
            "Is optional must be true or false."
        ),

    body("lines.*.notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes must not exceed 500 characters."
        ),

];


/*
|--------------------------------------------------------------------------
| Create Formulation Validation
|--------------------------------------------------------------------------
*/

const createFormulationValidation = [

    body("organisation_id")
        .notEmpty()
        .withMessage(
            "Organisation is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid organisation."
        ),

    body("finished_product_item_id")
        .notEmpty()
        .withMessage(
            "Finished product item is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid finished product item."
        ),

    body("formulation_name")
        .notEmpty()
        .withMessage(
            "Formulation name is required."
        )
        .trim()
        .isLength({ max: 200 })
        .withMessage(
            "Formulation name must not exceed 200 characters."
        ),

    body("formulation_type")
        .optional()
        .isIn([
            "MANUFACTURING",
            "REPACKING",
            "ASSEMBLY",
        ])
        .withMessage(
            "Invalid formulation type."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Is active must be true or false."
        ),

    /*
    |--------------------------------------------------------------------------
    | Version 1
    |--------------------------------------------------------------------------
    */

    body("version")
        .notEmpty()
        .withMessage(
            "Version details are required."
        )
        .isObject()
        .withMessage(
            "Version must be an object."
        ),

    body("version.standard_output_qty")
        .notEmpty()
        .withMessage(
            "Standard output quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Standard output quantity must be greater than or equal to 0."
        ),

    body("version.output_uom_id")
        .notEmpty()
        .withMessage(
            "Output UOM is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid output UOM."
        ),

    body("version.effective_from")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective from date."
        ),

    body("version.effective_to")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective to date."
        ),

    body("version.expected_process_loss_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Expected process loss percentage must be between 0 and 100."
        ),

    body("version.expected_output_qty")
        .notEmpty()
        .withMessage(
            "Expected output quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Expected output quantity must be greater than or equal to 0."
        ),

    body("version.instructions")
        .optional({ nullable: true })
        .trim(),

    /*
    |--------------------------------------------------------------------------
    | Lines
    |--------------------------------------------------------------------------
    */

    ...formulationLineValidation,

];


/*
|--------------------------------------------------------------------------
| Update Formulation Validation
|--------------------------------------------------------------------------
*/

const updateFormulationValidation = [

    body("formulation_name")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage(
            "Formulation name must not exceed 200 characters."
        ),

    body("formulation_type")
        .optional()
        .isIn([
            "MANUFACTURING",
            "REPACKING",
            "ASSEMBLY",
        ])
        .withMessage(
            "Invalid formulation type."
        ),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage(
            "Is active must be true or false."
        ),

];


/*
|--------------------------------------------------------------------------
| Create Version Validation
|--------------------------------------------------------------------------
*/

const createVersionValidation = [

    body("standard_output_qty")
        .notEmpty()
        .withMessage(
            "Standard output quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Standard output quantity must be greater than or equal to 0."
        ),

    body("output_uom_id")
        .notEmpty()
        .withMessage(
            "Output UOM is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid output UOM."
        ),

    body("effective_from")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective from date."
        ),

    body("effective_to")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective to date."
        ),

    body("expected_process_loss_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Expected process loss percentage must be between 0 and 100."
        ),

    body("expected_output_qty")
        .notEmpty()
        .withMessage(
            "Expected output quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Expected output quantity must be greater than or equal to 0."
        ),

    body("instructions")
        .optional({ nullable: true })
        .trim(),

    ...formulationLineValidation,

];


/*
|--------------------------------------------------------------------------
| Update Version Validation
|--------------------------------------------------------------------------
*/

const updateVersionValidation = [

    body("standard_output_qty")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Standard output quantity must be greater than or equal to 0."
        ),

    body("output_uom_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid output UOM."
        ),

    body("effective_from")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective from date."
        ),

    body("effective_to")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage(
            "Invalid effective to date."
        ),

    body("expected_process_loss_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Expected process loss percentage must be between 0 and 100."
        ),

    body("expected_output_qty")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Expected output quantity must be greater than or equal to 0."
        ),

    body("instructions")
        .optional({ nullable: true })
        .trim(),

    body("lines")
        .optional()
        .isArray()
        .withMessage(
            "Lines must be an array."
        ),

    body("lines.*.line_no")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid line number."
        ),

    body("lines.*.component_item_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid component item."
        ),

    body("lines.*.component_role")
        .optional()
        .isIn([
            "RAW_MATERIAL",
            "PRIMARY_PACKAGING",
            "SECONDARY_PACKAGING",
            "TERTIARY_PACKAGING",
            "SEMI_FINISHED_COMPONENT",
        ])
        .withMessage(
            "Invalid component role."
        ),

    body("lines.*.production_stage")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Production stage must not exceed 100 characters."
        ),

    body("lines.*.calculation_method")
        .optional()
        .isIn([
            "PER_OUTPUT_QTY",
            "FIXED_PER_BATCH",
            "ROUND_UP_BY_CAPACITY",
            "PERCENTAGE",
            "MANUAL",
        ])
        .withMessage(
            "Invalid calculation method."
        ),

    body("lines.*.required_qty")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Required quantity must be greater than or equal to 0."
        ),

    body("lines.*.required_uom_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid required UOM."
        ),

];


/*
|--------------------------------------------------------------------------
| Approve Version Validation
|--------------------------------------------------------------------------
*/

const approveVersionValidation = [

    body("approved_by")
        .notEmpty()
        .withMessage(
            "Approved by is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid approved by."
        ),

];


/*
|--------------------------------------------------------------------------
| Add Line Validation
|--------------------------------------------------------------------------
*/

const addFormulationLineValidation = [

    body("line_no")
        .notEmpty()
        .withMessage(
            "Line number is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid line number."
        ),

    body("component_item_id")
        .notEmpty()
        .withMessage(
            "Component item is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid component item."
        ),

    body("component_role")
        .notEmpty()
        .withMessage(
            "Component role is required."
        )
        .isIn([
            "RAW_MATERIAL",
            "PRIMARY_PACKAGING",
            "SECONDARY_PACKAGING",
            "TERTIARY_PACKAGING",
            "SEMI_FINISHED_COMPONENT",
        ])
        .withMessage(
            "Invalid component role."
        ),

    body("production_stage")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Production stage must not exceed 100 characters."
        ),

    body("calculation_method")
        .optional()
        .isIn([
            "PER_OUTPUT_QTY",
            "FIXED_PER_BATCH",
            "ROUND_UP_BY_CAPACITY",
            "PERCENTAGE",
            "MANUAL",
        ])
        .withMessage(
            "Invalid calculation method."
        ),

    body("required_qty")
        .notEmpty()
        .withMessage(
            "Required quantity is required."
        )
        .isFloat({ min: 0 })
        .withMessage(
            "Required quantity must be greater than or equal to 0."
        ),

    body("required_uom_id")
        .notEmpty()
        .withMessage(
            "Required UOM is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Invalid required UOM."
        ),

    body("basis_output_qty")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Invalid basis output quantity."
        ),

    body("pack_capacity")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Invalid pack capacity."
        ),

    body("process_wastage_percent")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Process wastage percentage must be between 0 and 100."
        ),

    body("rounding_method")
        .optional()
        .isIn([
            "NONE",
            "CEIL",
            "FLOOR",
            "NEAREST",
        ])
        .withMessage(
            "Invalid rounding method."
        ),

    body("rounding_multiple")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage(
            "Invalid rounding multiple."
        ),

    body("sequence_no")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Invalid sequence number."
        ),

    body("is_optional")
        .optional()
        .isBoolean()
        .withMessage(
            "Is optional must be true or false."
        ),

    body("notes")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Notes must not exceed 500 characters."
        ),

];


module.exports = {

    createFormulationValidation,

    updateFormulationValidation,

    createVersionValidation,

    updateVersionValidation,

    approveVersionValidation,

    addFormulationLineValidation,

};