const Sequelize = require('sequelize')
const db = require('./database.js')

const users = require('./users')

const bookmarks = db.define('bookmarks', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull:false
  },
  description: {
    type:Sequelize.STRING(255),
    allowNull:false
  },
  link:{
    type:Sequelize.STRING(255),
    allowNull:false
  },
}, { timestamps: false })


bookmarks.belongsTo(users,{
  foreignKey: {name:'user_id'}
})


module.exports = bookmarks
