const express = require('express');
const router = new express.Router();
const { tokenUtils } = require('../utils/token.utils');
const { oauthController } = require('../controllerV1/oauth.controller')

router.post('/login', oauthController.login, tokenUtils.generateToken, tokenUtils.sendToken);
router.post('/createAccount', oauthController.updateAccount);

module.exports = router;
