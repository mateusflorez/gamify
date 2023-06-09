import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import { toastOptions } from '../../utils/utils'
import UserImage from '../../../public/assets/dashboard/temp-user-img.png'
import { updateUserRoute } from '../../utils/APIRoutes'

function Profile() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    const [values, setValues] = useState({
        profession: "",
        username: "",
        email: "",
        password: "",
        newPassword: "",
        confirmPassword: ""
    })

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(await JSON.parse(user))
            setValues(await JSON.parse(user))
        }
    }

    useEffect(() => {
        checkCurrentUser()
    }, [])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function handleChange(e: { target: HTMLInputElement }) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    async function handleEdit() {
        const { profession, email, username } = values
        if (handleValidation("edit")) {
            const request = await axios.put(`${updateUserRoute}/${currentUser.id}`, {
                "profession": profession,
                "email": email,
                "username": username
            })
            if (request.data.status == false) {
                toast.error(`${t(request.data.message)}`, toastOptions)
            } else {
                localStorage.setItem('user', JSON.stringify(request.data.user))
                toast.success(`${t("success.edit")}`, toastOptions)
                const user = localStorage.getItem('user')
                if (user)
                    setCurrentUser(await JSON.parse(user))
            }
        }
    }

    async function handleEditPassword() {
        const { password, newPassword } = values
        if (handleValidation("editPassword")) {
            const request = await axios.put(`${updateUserRoute}/${currentUser.id}`, {
                "password": password,
                "newPassword": newPassword
            })
            if (request.data.status == false) {
                toast.error(`${t(request.data.message)}`, toastOptions)
            } else {
                localStorage.setItem('user', JSON.stringify(request.data.user))
                toast.success(`${t("success.edit")}`, toastOptions)
                const user = localStorage.getItem('user')
                if (user)
                    setCurrentUser(await JSON.parse(user))
            }
        }
    }

    function handleValidation(form: string) {
        const { profession, email, username, newPassword, confirmPassword } = values
        if (form == "edit") {
            if (profession == "") {
                toast.error(`${t('validation.noprofession')}`, toastOptions)
                return false
            }
            if (email === "") {
                toast.error(`${t('validation.noemail')}`, toastOptions)
                return false
            }
            if (username.length < 6) {
                toast.error(`${t('validation.smallusername')}`, toastOptions)
                return false
            }
            return true
        }
        if (form == "editPassword") {
            if (newPassword !== confirmPassword) {
                toast.error(`${t('validation.passworddiff')}`, toastOptions)
                return false
            }
            if (newPassword.length < 8) {
                toast.error(`${t('validation.smallpassword')}`, toastOptions)
                return false
            }
            return true
        }
    }

    return (
        <div className="flex flex-col w-full">
            <div className='p-8 flex flex-row gap-8'>
                <img className='w-60' src={UserImage} alt="User image" />
                <div className='flex flex-col gap-1'>
                    <span className="font-bold text-4xl pb-4">{currentUser?.username && capitalize(currentUser.username)}</span>
                    <span className="font-medium text-2xl pb-4">{t("stats.stats")}</span>
                    <div><span className='font-medium pr-2'>{t("stats.profession")}:</span>{currentUser?.profession && capitalize(currentUser.profession)}</div>
                    <div><span className='font-medium pr-2'>{t("stats.level")}:</span>{currentUser?.level && currentUser.level}</div>
                    <div><span className='font-medium pr-2'>{t("stats.experience")}:</span>{currentUser?.experience && currentUser.experience}</div>
                    <div><span className='font-medium pr-2'>{t("stats.gold")}:</span>{currentUser?.gold && currentUser.gold}</div>
                    <div><span className='font-medium pr-2'>{t("stats.completedmissions")}:</span>{currentUser?.completedMissions && currentUser.completedMissions}</div>
                </div>
            </div>
            <div className='flex flex-col px-8'>
                <span className="font-medium text-2xl pb-4">{t('userAuthForm.edit')}</span>
                <label htmlFor="username" className='pl-3 pb-2 font-semibold'>{t('userAuthForm.username')}</label>
                <input type="text" value={values?.username && values.username} name="username" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="profession" className='pl-3 pb-2 font-semibold'>{t('stats.profession')}</label>
                <input type="text" value={values?.profession && values.profession} name="profession" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="email" className='pl-3 pb-2 font-semibold'>{t('userAuthForm.email')}</label>
                <input type="email" value={values?.email && values.email} name="email" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                <button onClick={() => handleEdit()} type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary mb-10 self-center">{t('buttons.save')}</button>

                <span className="font-medium text-2xl pb-4">{t('userAuthForm.editpassword')}</span>
                <label htmlFor="password" className='pl-3 pb-2 font-semibold'>{t('userAuthForm.oldpassword')}</label>
                <input type="password" name="password" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="newPassword" className='pl-3 pb-2 font-semibold'>{t('userAuthForm.newpassword')}</label>
                <input type="password" name="newPassword" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="confirmPassword" className='pl-3 pb-2 font-semibold'>{t('userAuthForm.confirmpassword')}</label>
                <input type="password" name="confirmPassword" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                <button onClick={() => handleEditPassword()} type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary mb-10 self-center">{t('buttons.save')}</button>
            </div>
            <ToastContainer></ToastContainer>
        </div >
    )
}

export default Profile
