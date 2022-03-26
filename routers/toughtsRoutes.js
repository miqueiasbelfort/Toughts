const express = require('express')
const router = express.Router()

// controllers
const ToughtController = require("../controllers/ToughtController")


router.get("/", ToughtController.showToughts) //page home


module.exports = router