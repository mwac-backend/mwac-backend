const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { submissionOrderController } = require('../controllerV1/submission_order.controller');

router.post('/order/status', submissionOrderController.updateSubmissionOrder);
router.get('/order/status', submissionOrderController.getSubmissionOrder);
router.delete('/order/status', submissionOrderController.deleteSubmissionOrder);

mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;