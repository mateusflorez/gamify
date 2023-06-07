import { Request, Response, NextFunction } from "express"
import MissionsService from "../services/MissionsService"

async function createMission(req: Request, res: Response, next: NextFunction) {
    try {
        MissionsService.createMission(req.params.userId, req.body)

        return res.status(201).send()
    } catch (err) {
        next(err)
    }
}

async function getAllMissions(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId

        await MissionsService.verifyMissions(userId)

        const missions = await MissionsService.getMissions(userId)

        return res.status(200).json(missions)
    } catch (err) {
        next(err)
    }
}

async function getMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        const mission = await MissionsService.getMission(userId, id)

        return res.status(200).json(mission)
    } catch (err) {
        next(err)
    }
}

async function deleteMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        MissionsService.deleteMission(userId, id)

        return res.status(204).send()
    } catch (err) {
        next(err)
    }
}

async function updateMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId
        const data = req.body

        MissionsService.updateMission(userId, id, data)

        return res.status(200).send()
    } catch (err) {
        next(err)
    }
}

export default { createMission, getAllMissions, getMission, deleteMission, updateMission }
