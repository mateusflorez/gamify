import { Request, Response, NextFunction } from "express"
import ItemsService from "../services/ItemsService"

async function createItem(req: Request, res: Response, next: NextFunction) {
    try {
        ItemsService.createItem(req.params.userId, req.body)

        return res.status(201).send()
    } catch (err) {
        next(err)
    }
}

async function getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId

        const items = await ItemsService.getItems(userId)

        return res.status(200).json(items)
    } catch (err) {
        next(err)
    }
}

async function getItem(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.itemId

        const item = await ItemsService.getItem(userId, id)

        return res.status(200).json(item)
    } catch (err) {
        next(err)
    }
}

async function deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.itemId

        ItemsService.deleteItem(userId, id)

        return res.status(204).send()
    } catch (err) {
        next(err)
    }
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const id = req.params.itemId
        const data = req.body

        ItemsService.updateItem(userId, id, data)

        return res.status(200).send()
    } catch (err) {
        next(err)
    }
}

export default { createItem, getAllItems, getItem, deleteItem, updateItem }