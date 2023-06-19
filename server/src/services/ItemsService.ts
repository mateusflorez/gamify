import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface NewItemBody {
    name: string,
    description: string,
    price: string
}

async function createItem(userId: string, itemBody: NewItemBody, image: string) {
    const { name, description, price } = itemBody

    await prisma.item.create({
        data: {
            userId,
            description,
            name,
            price: parseFloat(price),
            image
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
            quantity: true,
            image: true
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
            quantity: true,
            image: true
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

async function updateItem(userId: string, id: string, itemBody: NewItemBody, image: string) {
    const { name, description, price } = itemBody

    await prisma.item.updateMany({
        where: {
            userId,
            id
        },
        data: {
            userId,
            description,
            name,
            price: parseFloat(price),
            image
        }
    })
}

export default { createItem, getItems, getItem, deleteItem, updateItem }
