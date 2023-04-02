const status = require('http-status')
// const BoorkmarkModel = require('../models/Boorkmarks.js')
const userModel = require('../models/users.js')
const tagsModel = require('../models/tags.js')
const bookmark_tags_Model = require('../models/bookmark_tags')
const bookmarksModel = require('../models/bookmarks.js')

const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
const tags = require('./tags.js')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env
const { QueryTypes } = require('sequelize');



function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}


const { SECRET } = process.env



async function add(tmp,val){
  const {title}= tmp.title
  const {description} = tmp.description
  const {link}=tmp.link
  const bk = await bookmarksModel.create({
     title: tmp.title,
     description: tmp.description,
     link:tmp.link,
     user_id:val
    })
  // const id = await bookmarksModel.findOne({where:{title:tmp.title}, attributes:['id']})
  //const tp = 
  for(let i =0 ; i<tmp.tags.length;i++){
      const p=await bookmark_tags_Model.create({
        bookmark_id: bk.id,
        tag_id:tmp.tags[i].id
      })
  }
}

async function modify(value,BoorkmarkId){
  await bookmarksModel.update({
    title:value.title,
    description:value.description,
    link:value.link
  },{
    where: {
      id: BoorkmarkId
    }
  })
}

async function remove(BoorkmarkId){
  await bookmark_tags_Model.destroy({
    where:{
      bookmark_id:BoorkmarkId
    }
  })

  await bookmarksModel.destroy({
    where: {
      id: BoorkmarkId
    }
  })
}


module.exports = {

  //Middleware qui permet de vérifier l'identité de l'utilisateur
  async verifyLogin(req,res,next){
    // #swagger.Boorkmarks = ['Who am I']
    // #swagger.summary = 'Get User login'
    if(!req.login == req.params.login )
      throw {code: 403, message: 'Forbidden'}

    next()
  },

  async AllBoorkmarks(req,res){
     // #swagger.Boorkmarks = ['Boorkmarks']
    // #swagger.summary = 'Get All Boorkmarks of the user'

   const user_id = req.id

//Liste des bookmarks d'un utilisateur
const data_tmp = await bookmarksModel.findAll({
  where: { user_id },
  attributes: ['id', 'title', 'description', 'link']
})

let data=[];
data_tmp.forEach(element => {
  data.push({"id":element.id,"title":element.title , 'description':element.description , "link":element.link})
});


// console.log("******************************************" + data)

// Boucle sur les bookmarks
for (let i = 0; i < data.length; i++) {

  //Liste des id de tags d'un bookmark
  const bookmark_tags = await bookmark_tags_Model.findAll({
    where: { bookmark_id: data[i].id },
    attributes: ['tag_id']
  })

  //Liste des noms et ids des tags d'un bookmark
  let tags_value = []

  // Boucle sur les tags
  
  for (let j = 0; j < bookmark_tags.length; j++) {
    if(bookmark_tags[j].tag_id!=null){
    const tag = await tagsModel.findOne({
      where: { id: bookmark_tags[j].tag_id },
      attributes: ['id', 'name']
    })
    tags_value.push({id:tag.id,name:tag.name})
  }
}

  // On construit le champ tags du bookmark :
  data[i].tags = tags_value
}

// if(data[0]!=null) console.log("data[0] sldfkslkf" +data[0].tags)


 
    // const tags = []

    // await tags_id.forEach(element => {
    //    val =  tagsModel.findAll({where: {id:element}, attributes: ['name']})
    //    tags.push(JSON.stringify({id:element,name:val}))
    // })
   

    if(!data) throw new CodeError('Boorkmarks not found', status.NOT_FOUND)

    res.json({ status: true, message: 'Returning Boorkmarks', data })
  },


  //Middleware qui permet de recuperer l'id d'un utilisateur
  async getUserId(req,res,next){
    if (!req.login) throw new CodeError('You must specify the name ', status.BAD_REQUEST)
    const name = req.params.user
    console.log(name)

    const tmp = await userModel.findOne({where:{name},attributes:['id']})
     console.log("*******************"+tmp.id)
    req.id = tmp.id

    next()
  },



  async newBoorkmark(req,res){
     // #swagger.Boorkmarks = ['Boorkmarks']
    // #swagger.summary = 'Create new user's Boorkmark'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { $name: 'Javascript'}}

     const tmp = (JSON.parse(req.body.data))
    // console.log(name.data)
     const user_id = req.id
      // await bookmarksModel.create({ name,user_id})

      add(tmp,user_id)
     .then(()=>res.json({ status: true, message: 'Boorkmark Added' }))
     .catch((err)=>{
      throw new CodeError('Add Failed',status.NOT_ACCEPTABLE)
     })
     

  },


  async getBoorkmark(req,res){

     // #swagger.Boorkmarks = ['Boorkmarks']
    // #swagger.summary = 'Get  user's Boorkmark with a particular id'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { id }}

    // const {user_id} = req.params.user
    const id = req.params.BoorkmarkId
    const data = await bookmarksModel.findOne({where:{id},attributes:['id','name']})

    if(!data) throw new CodeError('Boorkmark not found', status.NOT_FOUND)

    res.json({ status: true, message: 'Return Boorkmark', data })

  },

  async deleteBoorkmark(req,res){

     // #swagger.Boorkmarks = ['Boorkmarks']
    // #swagger.summary = 'Delete a user's Boorkmark'
   // #swagger.parameters['obj'] = { in: 'body', description:'Name ', schema: { where : {id: 'Javascript'}}}

    // const {user_id} = req.params.user
    // const id = req.params.BoorkmarkId
    
    // await bookmarksModel.destroy({
    //   where: {
    //     id: req.params.BoorkmarkId
    //   }
    // })
    console.log("*****************"+req.params.user)
    console.log("***************" + req.params.BookmarkId)
    const id = req.params.BookmarkId
     remove(id)
    .then(() => res.json({ status: true, message: 'Boorkmark delete' }))
    .catch(() => {throw new CodeError('Boorkmark not found', status.NOT_FOUND)})
    // if(!data) throw new CodeError('Boorkmark not found', status.NOT_FOUND)

    // await data.destroy()
    

  },

 
  async updateBoorkmark(req,res){

    
    // await bookmarksModel.update({name:(JSON.parse(req.body.data)).name},{
    //   where: {
    //     id: req.params.BoorkmarkId
    //   }
    // })
    const tmp = (JSON.parse(req.body.data))
    modify(tmp,req.params.BoorkmarkId)
    .then(()=>res.json({ status: true, message: 'Boorkmark Modified' }))
    .catch(() => {throw new CodeError('Boorkmark not found', status.NOT_FOUND)})

  }

}
