const userModel = require('../models/users.js')
const bookmarksModel = require('../models/bookmarks')
const tagsModel = require('../models/tags')
const bookmark_tagsModel = require('../models/bookmark_tags')



const bcrypt = require('bcrypt');
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // // Initialise la base avec quelques données
  // const passhash = await bcrypt.hash('123456', 2)
  // console.log(passhash)
  // await userModel.create({
  //   name: 'Sebastien Viardot'
  // })
  await userModel.create({
    name: 'fezeuyoe'
  })
  // await tagsModel.create({
  //   name:'JS' 
  // })

  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
  await require ('../models/bookmarks.js').sync({force:true})
  await require ('../models/tags.js').sync({force:true})
  await require ('../models/bookmark_tags.js').sync({force:true})

  


})()
