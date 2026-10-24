const express = require("express");

const router = express.Router();

const FormulationController =
    require("../controllers/formulation.controller");

const Authenticate =
    require("../middlewares/auth.middleware");

const validate =
    require("../middlewares/validate.middleware");

const {
    createFormulationValidation,
    updateFormulationValidation,
    createVersionValidation,
    updateVersionValidation,
    approveVersionValidation,
    addFormulationLineValidation,
} = require("../validations/formulation.validation");


/*
|--------------------------------------------------------------------------
| Formulation Routes
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Create Formulation
|--------------------------------------------------------------------------
|
| Creates:
| Formulation
|    └── V1
|         └── Lines
|
*/

router.post(

    "/",

    Authenticate,

    createFormulationValidation,

    validate,

    FormulationController.create

);


/*
|--------------------------------------------------------------------------
| List Formulations
|--------------------------------------------------------------------------
|
| GET /api/formulations
|
*/

router.get(

    "/",

    Authenticate,

    FormulationController.getAll

);


/*
|--------------------------------------------------------------------------
| Get Formulation
|--------------------------------------------------------------------------
|
| GET /api/formulations/:id
|
*/

router.get(

    "/:id",

    Authenticate,

    FormulationController.getById

);


/*
|--------------------------------------------------------------------------
| Update Formulation Master
|--------------------------------------------------------------------------
|
| PUT /api/formulations/:id
|
*/

router.put(

    "/:id",

    Authenticate,

    updateFormulationValidation,

    validate,

    FormulationController.update

);


/*
|--------------------------------------------------------------------------
| Delete / Deactivate Formulation
|--------------------------------------------------------------------------
|
| DELETE /api/formulations/:id
|
*/

router.delete(

    "/:id",

    Authenticate,

    FormulationController.delete

);


/*
|--------------------------------------------------------------------------
| Formulation Versions
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Create New Version
|--------------------------------------------------------------------------
|
| POST /api/formulations/:id/versions
|
*/

router.post(

    "/:id/versions",

    Authenticate,

    createVersionValidation,

    validate,

    FormulationController.createVersion

);


/*
|--------------------------------------------------------------------------
| List Versions
|--------------------------------------------------------------------------
|
| GET /api/formulations/:id/versions
|
*/

router.get(

    "/:id/versions",

    Authenticate,

    FormulationController.getVersions

);


/*
|--------------------------------------------------------------------------
| Get Specific Version
|--------------------------------------------------------------------------
|
| GET /api/formulations/:id/versions/:versionId
|
*/

router.get(

    "/:id/versions/:versionId",

    Authenticate,

    FormulationController.getVersion

);


/*
|--------------------------------------------------------------------------
| Update Draft Version
|--------------------------------------------------------------------------
|
| PUT /api/formulations/:id/versions/:versionId
|
*/

router.put(

    "/:id/versions/:versionId",

    Authenticate,

    updateVersionValidation,

    validate,

    FormulationController.updateVersion

);


/*
|--------------------------------------------------------------------------
| Approve Version
|--------------------------------------------------------------------------
|
| POST /api/formulations/:id/versions/:versionId/approve
|
*/

router.post(

    "/:id/versions/:versionId/approve",

    Authenticate,

    approveVersionValidation,

    validate,

    FormulationController.approveVersion

);


/*
|--------------------------------------------------------------------------
| Obsolete Version
|--------------------------------------------------------------------------
|
| POST /api/formulations/:id/versions/:versionId/obsolete
|
*/

router.post(

    "/:id/versions/:versionId/obsolete",

    Authenticate,

    FormulationController.obsoleteVersion

);


/*
|--------------------------------------------------------------------------
| Delete Draft Version
|--------------------------------------------------------------------------
|
| DELETE /api/formulations/:id/versions/:versionId
|
*/

router.delete(

    "/:id/versions/:versionId",

    Authenticate,

    FormulationController.deleteVersion

);


/*
|--------------------------------------------------------------------------
| Formulation Lines
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Add Line
|--------------------------------------------------------------------------
|
| POST /api/formulations/:id/versions/:versionId/lines
|
*/

router.post(

    "/:id/versions/:versionId/lines",

    Authenticate,

    addFormulationLineValidation,

    validate,

    FormulationController.addLine

);


/*
|--------------------------------------------------------------------------
| Update Line
|--------------------------------------------------------------------------
|
| PUT /api/formulations/:id/versions/:versionId/lines/:lineId
|
*/

router.put(

    "/:id/versions/:versionId/lines/:lineId",

    Authenticate,

    addFormulationLineValidation,

    validate,

    FormulationController.updateLine

);


/*
|--------------------------------------------------------------------------
| Delete Line
|--------------------------------------------------------------------------
|
| DELETE /api/formulations/:id/versions/:versionId/lines/:lineId
|
*/

router.delete(

    "/:id/versions/:versionId/lines/:lineId",

    Authenticate,

    FormulationController.deleteLine

);


module.exports = router;