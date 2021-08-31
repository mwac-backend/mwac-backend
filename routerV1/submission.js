const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { submissionController } = require('../controllerV1/submission_control.controller');
const {saveFileMiddleware} = require('../middleware/save_file.middleware');
const {submissionControllerDocument} = require('./../controllerV1/submission_control_document.controller');

router.post('/control', submissionController.updateSubmissionControl);
router.get('/control', submissionController.getSubmissionControl);
router.get('/control/all', submissionController.getSubmissionControlAll);
router.delete('/control', submissionController.deleteSubmissionControl);

router.post('/control/document', saveFileMiddleware.saveFile([{name: 'pathFile', maxCount: 5}]), submissionControllerDocument.updateControlSubmissionDocument);
router.get('/control/document', submissionControllerDocument.getControlSubmissionDocument);
router.delete('/control/document', submissionControllerDocument.deleteControlSubmissionDocument);



mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;