const router = require('express').Router()
router.use(require('./user'))
router.use(require("./tags"))
router.use(require("./token"))
router.use(require("./bookmarks"))
module.exports = router
