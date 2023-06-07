import { PrismaClient } from "@prisma/client"

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
    return await prisma.mission.findMany({
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

export default { createMission, getMissions, getMission, deleteMission, updateMission }
