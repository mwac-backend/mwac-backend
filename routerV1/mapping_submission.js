const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const {saveFileMiddleware} = require('../middleware/save_file.middleware');
const {mappingSubmissionController} = require('./../controllerV1/mapping_submission.controller');

router.post('/mapping', mappingSubmissionController.updateMappingSubmissionController);
router.get('/list-agency-by-mapping', mappingSubmissionController.getListAgencyBySubmissionControl);
router.get('/list-mapping-by-agency', mappingSubmissionController.getListMappingSubmissionControlByAgency);


mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;