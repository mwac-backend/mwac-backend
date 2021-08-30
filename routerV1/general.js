const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const {  generalController} = require('../controllerV1/general.controller');

router.get('/agency', generalController.getAgency);
router.get('/listUserByAgency', generalController.getUserByAgency);
router.get('/submissionOrderStatus', generalController.getSubmissionOrderStatus);
router.get('/submissionControlStatus', generalController.getSubmissionControlStatus);
router.get('/mappingSubmissionControlStatus', generalController.getMappingSubmissionControlStatus);

mainRouter.use(authValidation.validJWTNeeded ,router);

module.exports = mainRouter;

