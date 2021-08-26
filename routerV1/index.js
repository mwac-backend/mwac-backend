const express = require('express');
const router = new express.Router();

const oauthRouter = require('./oauth');
const userRouter = require('./users');
const submissionRouter = require('./submission');
const submissionOrderRouter = require('./submission_order')
const generalRouter = require('./general')

router.use('/oauth', oauthRouter);
router.use('/user', userRouter);
router.use('/submission', submissionRouter,submissionOrderRouter);
router.use('/', generalRouter);

module.exports = router;
