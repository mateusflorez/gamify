import { Router } from "express";
import { MissionsController } from "../controllers/MissionsController"

const missionRoutes = Router()
const missionsController = new MissionsController()

missionRoutes.post("/:userId", missionsController.createMission)
missionRoutes.get("/:userId", missionsController.getAllMissions)
missionRoutes.get("/:userId/:missionId", missionsController.getMission)
missionRoutes.delete("/:userId/:missionId", missionsController.deleteMission)
missionRoutes.put("/:userId/:missionId", missionsController.updateMission)

export { missionRoutes }
