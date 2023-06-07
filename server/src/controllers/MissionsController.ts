import { Request, Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"
import { DateTime } from 'luxon'
import MissionServices from "../services/MissionServices"

const prisma = new PrismaClient()

async function createMission(req: Request, res: Response, next: NextFunction) {
    try {
        MissionServices.createMission(req.params.userId, req.body)

        return res.status(201).send()
    } catch (err) {
        next(err)
    }
}

async function getAllMissions(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId

        await __verifyMissions(userId)

        const missions = await MissionServices.getMissions(userId)

        return res.status(200).json(missions)
    } catch (err) {
        next(err)
    }
}

async function getMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        const mission = await MissionServices.getMission(userId, id)

        return res.status(200).json(mission)
    } catch (err) {
        next(err)
    }
}

async function deleteMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        MissionServices.deleteMission(userId, id)

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

        MissionServices.updateMission(userId, id, data)

        return res.status(200).send()
    } catch (err) {
        next(err)
    }
}

async function __verifyMissions(userId: string) {
    const missions = await prisma.mission.findMany({
        where: {
            userId,
            completionTime: { not: null }
        },
        select: {
            id: true,
            type: true,
            completionTime: true
        }
    })

    const now = DateTime.now()

    await Promise.all(missions.map(async (mission) => {
        let completionTime

        if (mission.completionTime) {
            completionTime = DateTime.fromJSDate(mission.completionTime)

            const diff = now.diff(completionTime, 'hours').hours

            if (diff >= 24 && mission.type == 2) {
                await __setMissionActive(mission.id, userId)
            } else if (diff >= 168 && mission.type == 3) {
                await __setMissionActive(mission.id, userId)
            } else if (diff >= 720 && mission.type == 4) {
                await __setMissionActive(mission.id, userId)
            }
        }
    }))
}

async function __setMissionActive(id: string, userId: string) {
    await prisma.mission.updateMany({
        where: {
            userId,
            id
        },
        data: {
            status: true,
            completionTime: null
        }
    })

    return true
}



export default { createMission, getAllMissions, getMission, deleteMission, updateMission }
