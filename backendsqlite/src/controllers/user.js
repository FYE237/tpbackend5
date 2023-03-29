const status = require('http-status')
const userModel = require('../models/users.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

// function checkToken(req,res,next){
//   if(!req.header||!req.headers.hasOwnProperty('x-access-token'))
//     throw {code: 403, message: 'Token missing'}

//     if (!jws.verify(req.headers['x-access-token'],'HS256',SECRET))
//     throw {code: 403, message: 'Token invalid'}
//   // Le payload du token contient le login de l'utilisateur
//   // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
//   req.login=jws.decode(req.headers['x-access-token']).payload
//   // On appelle la fonction middleware suivante :
//   next()
// }

// function verifieAdmin(req,res,next){
//   // Code vérifiant que le login est admin (présent si une fonction middleware
//   // a au préalable ajouté le login dans req)
//   if (!req.login=='admin')
//     // Provoque une réponse en erreur avec un code de retour 403 
//     throw {code: 403, message: 'Forbidden'}
//   // On appelle la fonction middleware suivante que si la condition est vérifiée
//   next()
// }

module.exports = {
  // async getUserByEmail (req, res) {
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Get user by Email'
  //   if (!has(req.params, 'email')) throw new CodeError('You must specify the email', status.BAD_REQUEST)
  //   const { email } = req.params
  //   const data = await userModel.findOne({ where: { email }, attributes: ['id', 'name', 'email'] })
  //   if (!data) throw new CodeError('User not found', status.NOT_FOUND)
  //   res.json({ status: true, message: 'Returning user', data })
  // },

  // async checkToken(req,res,next){
  //   if(!req.header||!req.headers.hasOwnProperty('x-access-token'))
  //     throw {code: 403, message: 'Token missing'}
  
  //     if (!jws.verify(req.headers['x-access-token'],'HS256',SECRET))
  //     throw {code: 403, message: 'Token invalid'}
  //   // Le payload du token contient le login de l'utilisateur
  //   // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
  //   req.login=jws.decode(req.headers['x-access-token']).payload
  //   // On appelle la fonction middleware suivante :
  //   next()
  // },
  
  // async verifieAdmin(req,res,next){
  //   // Code vérifiant que le login est admin (présent si une fonction middleware
  //   // a au préalable ajouté le login dans req)
  //   if (!req.login=='admin')
  //     // Provoque une réponse en erreur avec un code de retour 403 
  //     throw {code: 403, message: 'Forbidden'}
  //   // On appelle la fonction middleware suivante que si la condition est vérifiée
  //   next()
  // },

  async getUsers (req, res) {
    // TODO : verify if the user that wants to get All users is an admin (using token...)
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All users'
    const data = await userModel.findAll({ attributes: ['id', 'name'] })
    res.json({ status: true, message: 'Returning users', data })
  },

  async newUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'New User'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { $name: 'John Doe'}}
    if (!has(req.body, ['name'])) throw new CodeError('You must specify the name ', status.BAD_REQUEST)
    const { name} = req.body
    console.log(req.body)
    await userModel.create({ name})
    res.json({ status: true, message: 'User Added' })
  },

  
  // async updateUser (req, res) {
  //   // TODO : verify if the user that wants to update this user is an admin or the user himself (using token...)
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Update User'
  //   // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
  //   if ((!has(req.body, ['name', 'email', 'password']))) throw new CodeError('You must specify the name, email and password', status.BAD_REQUEST)
  //   const { name, email, password } = req.body
  //   await userModel.update({ name, passhash: await bcrypt.hash(password, 2) }, { where: { email } })
  //   res.json({ status: true, message: 'User updated' })
  // },
  // async deleteUser (req, res) {
  //   // TODO : verify if the user that wants to update user is an admin (using token...)
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Delete User'
  //   if (!has(req.params, 'id')) throw new CodeError('You must specify the id', status.BAD_REQUEST)
  //   const { id } = req.params
  //   await userModel.destroy({ where: { id } })
  //   res.json({ status: true, message: 'User deleted' })
  // },
  // async login (req, res) {
  //   // #swagger.tags = ['Users']
  //   // #swagger.summary = 'Verify credentials of user using email and password and return token'
  //   // #swagger.parameters['obj'] = { in: 'body', schema: { $email: 'John.Doe@acme.com', $password: '12345'}}
  //   if (!has(req.body, ['email', 'password'])) throw new CodeError('You must specify the email and password', status.BAD_REQUEST)
  //   const { email, password } = req.body
  //   const user = await userModel.findOne({ where: { email } })
  //   if (user) {
  //     if (await bcrypt.compare(password, user.passhash)) {
  //       const token = jws.sign({ header: { alg: 'HS256' }, payload: email, secret: TOKENSECRET })
  //       res.json({ status: true, message: 'Login/Password ok', token })
  //       return
  //     }
  //   }
  //   res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong email/password' })
  // }
}
