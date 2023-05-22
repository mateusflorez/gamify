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
}

export { MissionsController }
