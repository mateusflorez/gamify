import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface RegisterRequestBody {
    username: string;
    email: string;
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
}

export { UsersController }
