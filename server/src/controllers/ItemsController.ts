import { Request, Response, NextFunction } from "express"
import ItemsService from "../services/ItemsService"
import multer from "multer"
import fs from "fs"

const storage = multer.diskStorage({
    destination: '../web/public/images/item/',
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({ storage: storage }).single('image')

async function createItem(req: Request, res: Response, next: NextFunction) {
    try {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return next(err);
            } else if (err) {
                return next(err);
            }

            const newImage = req.file ? req.file.filename : ""

            ItemsService.createItem(req.params.userId, req.body, newImage)

            return res.status(200).send()
        })
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

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return next(err);
            } else if (err) {
                return next(err);
            }

            const newImage = req.file ? req.file.filename : ""

            const item = await ItemsService.getItem(userId, id)

            if (item[0].image) {
                const oldImage = item[0].image;
                if (oldImage) {
                    const imagePath = '../web/public/images/item/' + oldImage;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Erro ao excluir a imagem antiga:', err);
                        }
                    });
                }
            }

            ItemsService.updateItem(req.params.userId, req.params.itemId, req.body, newImage)

            return res.status(200).send()
        })
    } catch (err) {
        next(err)
    }
}

export default { createItem, getAllItems, getItem, deleteItem, updateItem }
