const express = require('express')
const router = express.Router()
const tag = require('../controllers/tags.js')
const token = require('../controllers/token.js')

router.get('/bmt/:user/tags', token.verifieTokenPresent,token.verifieUser,tag.verifyLogin,tag.getUserId, tag.AllTags)
router.post('/bmt/:user/tags', token.verifieTokenPresent,token.verifieUser,tag.verifyLogin,tag.getUserId, tag.newTag)


router.get('/bmt/:user/tags/:tagId', token.verifieTokenPresent,token.verifieUser,tag.verifyLogin, tag.getTag)

router.delete('/bmt/:user/tags/:tagId', token.verifieTokenPresent,token.verifieUser,tag.verifyLogin, tag.deleteTag)

router.put('/bmt/:user/tags/:tagId', token.verifieTokenPresent,token.verifieUser,tag.verifyLogin, tag.updateTag)


// router.get('/api/users/:email', user.getUserByEmail)
// router.put('/api/users', user.updateUser)
// router.delete('/api/users/:id', user.deleteUser)

// router.post('/login', user.login)

module.exports = router
