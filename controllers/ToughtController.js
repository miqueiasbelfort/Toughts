const Tought = require('../models/Tought')
const User = require("../models/User")

const { Op } = require('sequelize') //Sistema de busca "Nomes parecidos"

module.exports = class ToughtController {
    
    static async showToughts(req, res) {
        let search = ''

        if (req.query.search){ //Se enviou algo pela url do method get
            search = req.query.search //O search vai receber esse valor
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = "DESC"
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`} //Filtrar o titulo com o Op: %% -> Indica coringa, ou seja vale tudo e antes  
            },
            order: [['createdAt', order]] //createAt para buscar pela order de , order
        })

        const toughts = toughtsData.map(result => result.get({plain: true}))

        let toughtsQty = toughts.length

        if(toughtsQty === 0){
            toughtsQty = false
        }

        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
           
            where: {id: userId},
            include: Tought, // Vai traser todos os toughts do user
            plain: true
        })

        //checando se o user existe
        if(!user){
            res.redirect('/login')
        }

        // console.log(user.Toughts)
        const toughts = user.Toughts.map((result) => result.dataValues)
        //console.log(toughts)
        let emptyToughts = false

        if(toughts.length === 0){
            emptyToughts = true
        }

        res.render('toughts/dashboard', {toughts, emptyToughts})
    }

    static createTought(req, res){
        res.render('toughts/create')
    }

    static async createToughtSave(req, res){

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {

            await Tought.create(tought)
            req.flash('message', 'Pensamento criado!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

        } catch(err) {
            console.log(err)
        }   

    }

    static async removeTought(req, res){
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({where: {id: id, UserId: UserId}})
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err){
            console.log(err)
        }
    }

    static async updateTought(req, res){

        const id = req.params.id

        const tought = await Tought.findOne({raw: true, where: {id: id}})

        res.render('toughts/edit', {tought})

    }

    static async updateToughtSave(req, res){
        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update( tought, {where: {id: id}})
            req.flash("message", 'Pensamento Atualizado!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err){
            console.log(err)
        }

    }

}