const Sequelize = require('sequelize')
const db = require('./database.js')

const users = require('./users')

const tags = db.define('tags', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull:false
  },
}, { timestamps: false })


tags.belongsTo(users,{
  foreignKey: 'user_id'
})


module.exports = tags
