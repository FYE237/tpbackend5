const express = require('express')
const router = express.Router()
const token = require('../controllers/token.js')

router.get('/getjwtDeleg/:user',token.getToken)

router.get('/whoami',token.verifieTokenPresent,token.verifieUser,token.whoami)

// router.get('/api/users/:email', user.getUserByEmail)
// router.put('/api/users', user.updateUser)
// router.delete('/api/users/:id', user.deleteUser)

// router.post('/login', user.login)

module.exports = router
