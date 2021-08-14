const express = require('express');
const router = new express.Router();
const mainRouter = new express.Router();
const { authValidation } = require('../middleware/auth.validation.middleware');
const { agencyController } = require('../controllerV1/agency.controller');

router.get('/', agencyController.getAgency);

mainRouter.use(authValidation.validJWTNeeded ,router);

module.exports = mainRouter;