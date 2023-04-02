const Sequelize = require('sequelize')
const db = require('./database.js')

const bookmarks = require('./bookmarks')
const tags = require('./tags')


const bookmark_tags = db.define('bookmark_tags', {

}, { timestamps: false })


bookmark_tags.belongsTo(bookmarks,{
  foreignKey: {name:'bookmark_id'}
})

bookmark_tags.belongsTo(tags,{
  foreignKey:{name:'tag_id'}
})


module.exports = bookmark_tags
