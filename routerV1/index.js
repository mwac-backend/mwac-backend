const express = require('express');
const router = new express.Router();

const oauthRouter = require('./oauth');
const userRouter = require('./users');
const submissionRouter = require('./submission');
const submissionOrderRouter = require('./submission_order')
const generalRouter = require('./general')
const mappingSubmissionOrderRouter = require('./mapping_submission')
router.use('/oauth', oauthRouter);
router.use('/user', userRouter);
router.use('/submission', submissionRouter,submissionOrderRouter,mappingSubmissionOrderRouter);
router.use('/', generalRouter);

module.exports = router;
