const express = require('express');
const router = new express.Router();

const oauthRouter = require('./oauth');
const userRouter = require('./users');
const submissionRouter = require('./submission');
const submissionOrderRouter = require('./submission_order')
const agency = require('./agency');

router.use('/oauth', oauthRouter);
router.use('/user', userRouter);
router.use('/submission', submissionRouter,submissionOrderRouter);
router.use('/agency', agency);

module.exports = router;
