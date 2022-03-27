module.exports.checkAuth = (req, res, next) => {

    const userid = req.session.userid //pegando a session

    if(!userid){ //Se a session não existir
        res.redirect('/login')
    }

    next()

}

//Essa função check se o usuário está logado para poder
// Dar permisão para entrar na página de daskboard