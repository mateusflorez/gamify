import { Router } from "express";
import MissionsController from "../controllers/MissionsController"

const missionRoutes = Router()

missionRoutes.post("/:userId", MissionsController.createMission)
missionRoutes.get("/:userId", MissionsController.getAllMissions)
missionRoutes.get("/:userId/:missionId", MissionsController.getMission)
missionRoutes.delete("/:userId/:missionId", MissionsController.deleteMission)
missionRoutes.put("/:userId/:missionId", MissionsController.updateMission)

export { missionRoutes }
