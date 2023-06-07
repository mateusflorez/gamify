import { Request, Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"
import { DateTime } from 'luxon'

const prisma = new PrismaClient()

interface NewMissionRequestBody {
    name: string,
    experience: number,
    type: number,
    difficulty: number,
    description: string
}

async function createMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const { name, experience, description, type, difficulty }: NewMissionRequestBody = req.body

        await prisma.mission.create({
            data: {
                userId,
                description,
                name,
                experience,
                difficulty,
                type
            }
        })

        return res.status(201).send()
    } catch (err) {
        next(err)
    }
}

async function getAllMissions(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId

        await __verifyMissions(userId)

        const missions = await prisma.mission.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                name: true,
                experience: true,
                status: true,
                type: true,
                description: true,
                difficulty: true
            },
            orderBy: [
                { status: 'desc' },
                { name: 'asc' }
            ]
        })

        return res.status(200).json(missions)
    } catch (err) {
        next(err)
    }
}

async function getMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        const mission = await prisma.mission.findMany({
            where: {
                id,
                userId
            },
            select: {
                id: true,
                name: true,
                experience: true,
                status: true,
                type: true,
                description: true,
                difficulty: true
            }
        })

        return res.status(200).json(mission)
    } catch (err) {
        next(err)
    }
}

async function deleteMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId

        try {
            await prisma.mission.deleteMany({
                where: {
                    userId,
                    id
                }
            })
            return res.status(204).send()
        } catch {
            return res.status(500).json({ status: false })
        }
    } catch (err) {
        next(err)
    }
}

async function updateMission(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.missionId
        const data = req.body

        await prisma.mission.updateMany({
            where: {
                userId,
                id
            },
            data: data.mission
        })

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
