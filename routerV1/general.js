const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const {  generalController} = require('../controllerV1/general.controller');

router.get('/agency', generalController.getAgency);
router.get('/submissionOrderStatus', generalController.getSubmissionOrderStatus);
router.get('/submissionControlStatus', generalController.getSubmissionControlStatus);

mainRouter.use(authValidation.validJWTNeeded ,router);

module.exports = mainRouter;