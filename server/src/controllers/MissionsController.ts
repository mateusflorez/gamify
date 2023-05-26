import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface NewMissionRequestBody {
    name: string,
    experience: number,
    type: number
}


class MissionsController {
    async createMission(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const { name, experience, type }: NewMissionRequestBody = req.body

            await prisma.mission.create({
                data: {
                    userId,
                    name,
                    experience,
                    type
                }
            })

            return res.status(201).send()
        } catch (err) {
            next(err)
        }
    }

    async getAllMissions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId

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
                    description: true
                },
                orderBy: [
                    { status: 'desc' },
                    { createdAt: 'desc' }
                ]
            })

            return res.status(200).json(missions)
        } catch (err) {
            next(err)
        }
    }

    async getMission(req: Request, res: Response, next: NextFunction) {
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
                    description: true
                }
            })

            return res.status(200).json(mission)
        } catch (err) {
            next(err)
        }
    }

    async deleteMission(req: Request, res: Response, next: NextFunction) {
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

    async updateMission(req: Request, res: Response, next: NextFunction) {
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
}

export { MissionsController }
