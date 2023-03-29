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


const { SECRET } = process.env

module.exports = {

  async getToken (req, res) {
    // TODO : verify if the user that wants to get All users is an admin (using token...)
    // #swagger.tags = ['Token']
    // #swagger.summary = 'Get User Token'
    const data = {token : jws.sign({
      header: { alg: 'HS256' },
      payload: req.params.user,
      secret: SECRET,
    })}
    res.json({ status: true, message: 'Returning Token', data })
  },


  async verifieTokenPresent(req,res,next) {
    // Code vérifiant qu'il y a bien un token dans l'entête
    if (!req.headers || !req.headers.hasOwnProperty('x-access-token'))
      throw {code: 403, message: 'Token missing'}
    // Code vérifiant la validité du token 
    if (!jws.verify(req.headers['x-access-token'],'HS256',SECRET))
      throw {code: 403, message: 'Token invalid'}
    // Le payload du token contient le login de l'utilisateur
    // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
    req.login=jws.decode(req.headers['x-access-token']).payload
    // On appelle la fonction middleware suivante :
    next()
  },
   
  async verifieUser(req,res,next){
    // Code vérifiant que le login est admin (présent si une fonction middleware
    // a au préalable ajouté le login dans req)

    const {  name } = {name : req.login}
    const data = await userModel.findOne({ where: { name }, attributes: ['id', 'name'] })

    if(!data) throw new CodeError('User not found', status.NOT_FOUND)

    if (!req.login=='admin')
      // Provoque une réponse en erreur avec un code de retour 403 
      throw {code: 403, message: 'Forbidden'}
    // On appelle la fonction middleware suivante que si la condition est vérifiée
    next()
  },


  async whoami(req,res){
    // #swagger.tags = ['Who am I']
    // #swagger.summary = 'Get User login'
   const  data  =  req.login
    res.json({  data })

  }


}
