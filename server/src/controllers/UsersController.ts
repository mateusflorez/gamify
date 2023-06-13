import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'
import Joi from "joi";
import UsersService from "../services/UsersService";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: '../web/public/images/',
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({ storage: storage }).single('image')

const registerUserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const loginUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const updateUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    newPassword: Joi.string().min(6),
    level: Joi.number().integer().min(0),
    profession: Joi.string(),
    experience: Joi.number().integer().min(0),
    gold: Joi.number().integer().min(0),
    completedMissions: Joi.number().integer().min(0)
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

        if (await UsersService.getUser({ username: username }))
            return res.json({ message: "validation.usedusername", status: false })

        if (await UsersService.getUser({ email: email }))
            return res.json({ message: "validation.usedemail", status: false })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await UsersService.createUser(username, email, hashedPassword)

        const { id, level, profession, experience, gold, completedMissions, image } = user;

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
                completedMissions,
                image
            }
        })
    } catch (err) {
        next(err)
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = req.body

        const { error } = loginUserSchema.validate(req.body);

        if (error) {
            return res.json({
                status: false,
                message: "error." + error.details[0].context?.label
            });
        }

        const user = await UsersService.getUser({ username: username })

        if (!user)
            return res.json({ message: "validation.incorrect", status: false })

        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck)
            return res.json({ message: "validation.incorrect", status: false })

        const { id, email, level, profession, experience, gold, completedMissions, image } = user;

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
                completedMissions,
                image
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

        const currentUser = await UsersService.getUser({ id: userId })

        if (data.username && data.username != currentUser?.username) {
            const usernameCheck = await UsersService.getUser({ username: data.username })
            if (usernameCheck)
                return res.json({ message: "validation.usedusername", status: false })
        }

        if (data.email && data.email != currentUser?.email) {
            const emailCheck = await UsersService.getUser({ email: data.email })
            if (emailCheck)
                return res.json({ message: "validation.usedemail", status: false })
        }

        if (data.password && currentUser) {
            const passwordCheck = await bcrypt.compare(data.password, currentUser.password)
            if (!passwordCheck)
                return res.json({ message: "validation.incorrectPassword", status: false })
            else {
                data.password = await bcrypt.hash(data.newPassword, 10)
                delete data.newPassword;
            }
        }

        const user = await UsersService.updateUser(userId, data)

        const { id, username, email, level, profession, experience, gold, completedMissions, image } = user;

        return res.status(200).json({
            user: {
                id,
                username,
                email,
                level,
                profession,
                experience,
                gold,
                completedMissions,
                image
            }
        })
    } catch (err) {
        next(err)
    }
}

async function updateUserImage(req: Request, res: Response, next: NextFunction) {
    try {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return next(err);
            } else if (err) {
                return next(err);
            }

            const userId = req.params.userId
            const newImage = req.file ? req.file.filename : "";

            const user = await UsersService.getUser({ id: userId })
            const oldImage = user?.image;
            if (oldImage) {
                const imagePath = '../web/public/images/' + oldImage;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Erro ao excluir a imagem antiga:', err);
                    }
                });
            }

            const updatedUser = await UsersService.updateUser(userId, { image: newImage })

            const { id, username, email, level, profession, experience, gold, completedMissions, image } = updatedUser;

            return res.status(200).json({
                user: {
                    id,
                    username,
                    email,
                    level,
                    profession,
                    experience,
                    gold,
                    completedMissions,
                    image
                }
            })
        })
    } catch (err) {
        next(err)
    }
}

export default { login, register, updateUser, updateUserImage }
