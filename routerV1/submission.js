const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { submissionController } = require('../controllerV1/submission.controller');

router.post('/order', submissionController.updateSubmissionControl);
router.get('/order', submissionController.getSubmissionControl);
router.delete('/order', submissionController.deleteSubmissionControl);

mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;