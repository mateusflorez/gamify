import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const server = app.listen(3333, () => console.log('Listening on port 3333'))
