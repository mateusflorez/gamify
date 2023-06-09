import { Router } from "express";
import UsersController from "../controllers/UsersController"

const userRoutes = Router()

userRoutes.post("/register", UsersController.register)
userRoutes.post("/login", UsersController.login)
userRoutes.put("/update/:userId", UsersController.updateUser)
userRoutes.put("/update-image/:userId", UsersController.updateUserImage)

export { userRoutes }
