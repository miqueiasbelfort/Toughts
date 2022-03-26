const { DataTypes } = require('sequelize')

const db = require('../db/conn')

// User
const User = require('./User')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, //Não pode ser null
        require: true
    }
})

//Relacionamento
Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought