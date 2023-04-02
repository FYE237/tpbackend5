const express = require('express')
const router = express.Router()
const bookmark = require('../controllers/bookmarks.js')
const token = require('../controllers/token.js')

router.get('/bmt/:user/bookmarks', token.verifieTokenPresent,token.verifieUser,bookmark.verifyLogin,bookmark.getUserId, bookmark.AllBoorkmarks)
router.post('/bmt/:user/bookmarks', token.verifieTokenPresent,token.verifieUser,bookmark.verifyLogin,bookmark.getUserId, bookmark.newBoorkmark)


router.get('/bmt/:user/bookmarks/:BookmarkId', token.verifieTokenPresent,token.verifieUser,bookmark.verifyLogin, bookmark.getBoorkmark)

router.delete('/bmt/:user/bookmarks/:BookmarkId', token.verifieTokenPresent,token.verifieUser,bookmark.verifyLogin, bookmark.deleteBoorkmark)

router.put('/bmt/:user/bookmarks/:BookmarkId', token.verifieTokenPresent,token.verifieUser,bookmark.verifyLogin, bookmark.updateBoorkmark)




module.exports = router
