import { Router } from "express";
import { MissionsController } from "../controllers/MissionsController"

const missionRoutes = Router()
const missionsController = new MissionsController()

missionRoutes.post("/new-mission/:userId", missionsController.createMission)

export { missionRoutes }
