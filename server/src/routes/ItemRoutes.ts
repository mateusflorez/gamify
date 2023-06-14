import { Router } from "express";
import ItemsController from "../controllers/ItemsController"

const itemRoutes = Router()

itemRoutes.post("/:userId", ItemsController.createItem)
itemRoutes.get("/:userId", ItemsController.getAllItems)
itemRoutes.get("/:userId/:itemId", ItemsController.getItem)
itemRoutes.delete("/:userId/:itemId", ItemsController.deleteItem)
itemRoutes.put("/:userId/:itemId", ItemsController.updateItem)

export { itemRoutes }
