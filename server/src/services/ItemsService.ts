import { PrismaClient } from "@prisma/client"
import { DateTime } from 'luxon'

const prisma = new PrismaClient()

interface NewItemBody {
    name: string,
    description: string,
    price: number
}

async function createItem(userId: string, itemBody: NewItemBody) {
    const { name, description, price } = itemBody

    await prisma.item.create({
        data: {
            userId,
            description,
            name,
            price
        }
    })

    return true
}

async function getItems(userId: string) {
    const items = await prisma.item.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            name: true,
            price: true,
            description: true,
            quantity: true
        },
        orderBy: [
            { name: 'asc' }
        ]
    })

    return items
}

async function getItem(userId: string, id: string) {
    return await prisma.item.findMany({
        where: {
            id,
            userId
        },
        select: {
            id: true,
            name: true,
            price: true,
            description: true,
            quantity: true
        }
    })
}

async function deleteItem(userId: string, id: string) {
    await prisma.item.deleteMany({
        where: {
            userId,
            id
        }
    })
}

async function updateItem(userId: string, id: string, data: object) {
    await prisma.item.updateMany({
        where: {
            userId,
            id
        },
        data: data
    })
}

export default { createItem, getItems, getItem, deleteItem, updateItem }
