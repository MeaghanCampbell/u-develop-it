// this file is a central hub to pull all files together

const express = require('express')
const router = express.Router();

router.use(require('./candidateRoutes'))
router.use(require('./partyRoutes'))
router.use(require('./voterRoutes'))

module.exports = router;