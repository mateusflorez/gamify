import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    username: string;
    password: string;
}

class UsersController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password }: RegisterRequestBody = req.body

            const usernameCheck = await prisma.user.findUnique({ where: { username: username } })
            if (usernameCheck)
                return res.json({ message: "validation.usedusername", status: false })

            const emailCheck = await prisma.user.findUnique({ where: { email } })
            if (emailCheck)
                return res.json({ message: "validation.usedemail", status: false })

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            })

            return res.status(201).json({
                status: true,
                user: { user }
            })
        } catch (err) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password }: LoginRequestBody = req.body

            const user = await prisma.user.findUnique({ where: { username } })
            if (!user)
                return res.json({ message: "validation.incorrect", status: false })

            const passwordCheck = await bcrypt.compare(password, user.password)
            if (!passwordCheck)
                return res.json({ message: "validation.incorrect", status: false })

            return res.status(200).json({
                status: true,
                user: { user }
            })
        } catch (err) {
            next(err)
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId
            const data = req.body

            const user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: data.user
            })

            return res.status(200).json({
                user: { user }
            })
        } catch (err) {
            next(err)
        }
    }
}

export { UsersController }
