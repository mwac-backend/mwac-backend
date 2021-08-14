const express = require('express');
const router = new express.Router();
const { userController } = require('../controllerV1/user.controller');
const { authValidation } = require('../middleware/auth.validation.middleware');

router.get('/info', authValidation.validJWTNeeded, userController.info)

module.exports = router;
