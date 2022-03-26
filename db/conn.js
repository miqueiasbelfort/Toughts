const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Connected with Database!')
} catch(err){
    console.log(`Database don't connected: ${err}`)
}

module.exports = sequelize