import { PrismaClient } from "@prisma/client"
import { DateTime } from 'luxon'

const prisma = new PrismaClient()

interface NewMissionBody {
    name: string,
    experience: number,
    type: number,
    difficulty: number,
    description: string
}

async function createMission(userId: string, missionBody: NewMissionBody) {
    const { name, experience, description, type, difficulty } = missionBody

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

    return true
}

async function getMissions(userId: string) {
    const activeMissions = await __countActiveMissions(userId);

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

    return {
        missions,
        activeMissions
    }
}

async function getMission(userId: string, id: string) {
    return await prisma.mission.findMany({
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
}

async function deleteMission(userId: string, id: string) {
    await prisma.mission.deleteMany({
        where: {
            userId,
            id
        }
    })
}

async function updateMission(userId: string, id: string, data: object) {
    await prisma.mission.updateMany({
        where: {
            userId,
            id
        },
        data: data
    })
}

async function verifyMissions(userId: string) {
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

async function __countActiveMissions(userId: string) {
    return await prisma.mission.count({
        where: {
            userId,
            status: true
        }
    });
}

export default { createMission, getMissions, getMission, deleteMission, updateMission, verifyMissions }
