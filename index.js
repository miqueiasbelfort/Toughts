const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

//chamando a conexão com o database
const conn = require('./db/conn')

//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

//Import Controller
const ToughtController = require('./controllers/ToughtController')

//Import Rotas
const toughtsRoutes = require("./routers/toughtsRoutes")
const authRoutes = require('./routers/authRoutes')

//configuração do handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//configuração para receber respostas do body
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// session meddleware *ELe diz onde o express vai salvar as sessions
app.use(
    session({
        name: "session",
        secret: "nosso_secret", // "Ficar increbravel"
        resave: false, // Quando a session cair ele vai desconectar
        saveUninitialized: false, 
        store: new FileStore({ //Onde vai salvar ela 
            logFn: function() {}, //Importante
            path: require('path').join(require('os').tmpdir(), "session") //O caminho para a pasta
        }),
        cookie: {
            secure: false, //
            maxAge: 360000, //O tempo que dura: 1 dia
            expires: new Date(Date.now() + 360000), //Forçar a expiração em 1 dia
            httpOnly: true
        }
    }),
)

// Flash messages
app.use(flash())

// public
app.use(express.static('public'))

// salvar a session na resposta
app.use((req, res, next) => {

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})

//Rotas
app.use("/toughts", toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

conn.sync().then(() => app.listen(3000)).catch(err => console.log(err))
