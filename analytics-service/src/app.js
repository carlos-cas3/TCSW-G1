const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res) => {
    res.json({
        message: "Analytics Service funcionando"
    })
})

const PORT = 3002

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en puerto ${PORT}`)
})
