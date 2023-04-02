const status = require('http-status')
const tagModel = require('../models/tags.js')
const userModel = require('../models/users')
// const bookmark_tags_Model = require('../models/bookmark_tags')

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


async function add(name,user_id){
  await tagModel.create({ name,user_id})
}

async function modify(value,tagId){
  await tagModel.update({name:value},{
    where: {
      id: tagId
    }
  })
}

async function remove(tagId){
  await tagModel.destroy({
    where: {
      id: tagId
    }
  })
}


module.exports = {

  //Middleware qui permet de vérifier l'identité de l'utilisateur
  async verifyLogin(req,res,next){
    // #swagger.tags = ['Who am I']
    // #swagger.summary = 'Get User login'
    if(!req.login == req.params.login )
      throw {code: 403, message: 'Forbidden'}

    next()
  },

  async AllTags(req,res){
     // #swagger.tags = ['Tags']
    // #swagger.summary = 'Get All Tags of the user'

    const user_id = req.id
    const data = await tagModel.findAll({where:{user_id}, attributes: ['id', 'name','user_id'] })

    if(!data) throw new CodeError('TagS not found', status.NOT_FOUND)

    res.json({ status: true, message: 'Returning tags', data })
  },


  //Middleware qui permet de recuperer l'id d'un utilisateur
  async getUserId(req,res,next){
    if (!req.login) throw new CodeError('You must specify the name ', status.BAD_REQUEST)
    const name = req.params.user
    console.log(name)

    const tmp = await userModel.findOne({where:{name},attributes:['id']})
    // console.log(tmp.id)
    req.id = tmp.id

    next()
  },



  async newTag(req,res){
     // #swagger.tags = ['Tags']
    // #swagger.summary = 'Create new user's Tag'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { $name: 'Javascript'}}

     const name = (JSON.parse(req.body.data)).name
    // console.log(name.data)
     const user_id = req.id
      // await tagModel.create({ name,user_id})

      add(name,user_id)
     .then(()=>res.json({ status: true, message: 'Tag Added' }))
     .catch((err)=>{
      throw new CodeError('Add Failed',status.NOT_ACCEPTABLE)
     })
     

  },


  async getTag(req,res){

     // #swagger.tags = ['Tags']
    // #swagger.summary = 'Get  user's Tag with a particular id'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { id }}

    // const {user_id} = req.params.user
    const id = req.params.tagId
    const data = await tagModel.findOne({where:{id},attributes:['id','name']})

    if(!data) throw new CodeError('Tag not found', status.NOT_FOUND)

    res.json({ status: true, message: 'Return tag', data })

  },

  async deleteTag(req,res){

     // #swagger.tags = ['Tags']
    // #swagger.summary = 'Delete a user's Tag'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { where : {id: 'Javascript'}}}

    // const {user_id} = req.params.user
    // const id = req.params.tagId
    
    // await tagModel.destroy({
    //   where: {
    //     id: req.params.tagId
    //   }
    // })
     remove(req.params.tagId)
    .then(() => res.json({ status: true, message: 'Tag delete' }))
    .catch(() => {throw new CodeError('Tag not found', status.NOT_FOUND)})
    // if(!data) throw new CodeError('Tag not found', status.NOT_FOUND)

    // await data.destroy()
    

  },

 
  async updateTag(req,res){

    
    // await tagModel.update({name:(JSON.parse(req.body.data)).name},{
    //   where: {
    //     id: req.params.tagId
    //   }
    // })
    const tmp = (JSON.parse(req.body.data)).name
    modify(tmp,req.params.tagId)
    .then(()=>res.json({ status: true, message: 'Tag Modified' }))
    .catch(() => {throw new CodeError('Tag not found', status.NOT_FOUND)})

  }

}
