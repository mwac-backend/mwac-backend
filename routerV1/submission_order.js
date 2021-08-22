const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { submissionOrderController } = require('../controllerV1/submission_order.controller');
const {saveFileMiddleware} = require('../middleware/save_file.middleware');
const {submissionOrderDocument} = require('./../controllerV1/submission_order_document.controller')
router.post('/order', submissionOrderController.updateSubmissionOrder);
router.get('/order', submissionOrderController.getSubmissionOrder);
router.delete('/order', submissionOrderController.deleteSubmissionOrder);

router.post('/order/document', saveFileMiddleware.saveFile([{name: 'pathFile', maxCount: 1}]), submissionOrderDocument.updateOrderDocument);


mainRouter.use(authValidation.validJWTNeeded, router)
module.exports = mainRouter;