import express from "express"
import cors from "cors"

import { userRoutes } from "./routes/UserRoutes"
import { missionRoutes } from "./routes/MissionRoutes"
import { itemRoutes } from "./routes/ItemRoutes"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", userRoutes)
app.use("/api/mission", missionRoutes)
app.use("/api/item", itemRoutes)

const server = app.listen(3333, () => console.log('Listening on port 3333'))
