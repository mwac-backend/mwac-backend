const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { submissionController } = require('../controllerV1/submission.controller');

router.post('/control', submissionController.updateSubmissionControl);
router.get('/control', submissionController.getSubmissionControl);
router.delete('/control', submissionController.deleteSubmissionControl);

mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;