import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import Joi from "joi";

const prisma = new PrismaClient()

const registerUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
})

interface LoginRequestBody {
    username: string
    password: string
}

const updateUserSchema = Joi.object({
    user: Joi.object({
        username: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        newPassword: Joi.string().min(6),
        level: Joi.number().integer().min(0),
        profession: Joi.string(),
        experience: Joi.number().integer().min(0),
        gold: Joi.number().integer().min(0),
        completedMissions: Joi.number().integer().min(0),
    }),
})

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password } = req.body

        const { error } = registerUserSchema.validate(req.body);

        if (error) {
            return res.json({
                status: false,
                message: "error." + error.details[0].context?.label
            });
        }

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

        const { id, level, profession, experience, gold, completedMissions } = user;

        return res.status(201).json({
            status: true,
            user: {
                id,
                username,
                email,
                level,
                profession,
                experience,
                gold,
                completedMissions
            }
        })
    } catch (err) {
        next(err)
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password }: LoginRequestBody = req.body

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user)
            return res.json({ message: "validation.incorrect", status: false })

        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck)
            return res.json({ message: "validation.incorrect", status: false })

        const { id, email, level, profession, experience, gold, completedMissions } = user;

        return res.status(200).json({
            status: true,
            user: {
                id,
                username,
                email,
                level,
                profession,
                experience,
                gold,
                completedMissions
            }
        })
    } catch (err) {
        next(err)
    }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId
        const data = req.body

        const { error } = updateUserSchema.validate(req.body);

        if (error) {
            return res.json({
                status: false,
                message: "error." + error.details[0].context?.label
            });
        }

        const currentUser = await prisma.user.findUnique({ where: { id: userId } })

        if (data.user.username && data.user.username != currentUser?.username) {
            const usernameCheck = await prisma.user.findUnique({ where: { username: data.user.username } })
            if (usernameCheck)
                return res.json({ message: "validation.usedusername", status: false })
        }

        if (data.user.email && data.user.email != currentUser?.email) {
            const emailCheck = await prisma.user.findUnique({ where: { username: data.user.email } })
            if (emailCheck)
                return res.json({ message: "validation.usedemail", status: false })
        }

        if (data.user.password && currentUser) {
            const passwordCheck = await bcrypt.compare(data.user.password, currentUser.password)
            if (!passwordCheck)
                return res.json({ message: "validation.incorrectPassword", status: false })
            else {
                data.user.password = await bcrypt.hash(data.user.newPassword, 10)
                delete data.user.newPassword;
            }
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: data.user
        })

        const { id, username, email, level, profession, experience, gold, completedMissions } = user;

        return res.status(200).json({
            user: {
                id,
                username,
                email,
                level,
                profession,
                experience,
                gold,
                completedMissions
            }
        })
    } catch (err) {
        next(err)
    }
}

export default { login, register, updateUser }
