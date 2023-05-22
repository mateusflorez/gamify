import express from "express"
import cors from "cors"

import { userRoutes } from "./routes/UserRoutes"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", userRoutes)

const server = app.listen(3333, () => console.log('Listening on port 3333'))
