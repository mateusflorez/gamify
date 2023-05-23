import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import UserImage from '../../../public/assets/dashboard/temp-user-img.png'

function Profile() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    const [values, setValues] = useState({
        profession: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        const checkCurrentUser = async () => {
            const user = localStorage.getItem('user')
            if (user)
                setCurrentUser(await JSON.parse(user))
        }
        checkCurrentUser()
    }, [])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    return (
        <div className="flex flex-col w-full">
            <div className='p-8 flex flex-row gap-8'>
                <img className='w-60' src={UserImage} alt="User image" />
                <div className='flex flex-col gap-1'>
                    <span className="font-bold text-4xl pb-4">{currentUser?.username && capitalize(currentUser.username)}</span>
                    <span className="font-medium text-2xl pb-4">{t("stats.stats")}</span>
                    <div><span className='font-medium pr-2'>{t("stats.profession")}:</span>{currentUser?.profession && capitalize(currentUser.profession)}</div>
                    <div><span className='font-medium pr-2'>{t("stats.level")}:</span>{currentUser?.level && capitalize(currentUser.level)}</div>
                    <div><span className='font-medium pr-2'>{t("stats.experience")}:</span>{currentUser?.experience && capitalize(currentUser.experience)}</div>
                    <div><span className='font-medium pr-2'>{t("stats.gold")}:</span>{currentUser?.gold && capitalize(currentUser.gold)}</div>
                    <div><span className='font-medium pr-2'>{t("stats.completedmissions")}:</span>{currentUser?.completedMissions && capitalize(currentUser.completedMissions)}</div>
                </div>
            </div>
            <div className='flex flex-col px-8'>
                <span className="font-medium text-2xl pb-4">{t('userAuthForm.edit')}</span>
                <label htmlFor="username" className='pl-3 font-semibold'>{t('userAuthForm.username')}</label>
                <input type="text" value={currentUser?.username && capitalize(currentUser.username)} name="username" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="profession" className='pl-3 font-semibold'>{t('stats.profession')}</label>
                <input type="text" value={currentUser?.profession && capitalize(currentUser.profession)} name="profession" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="email" className='pl-3 font-semibold'>{t('userAuthForm.email')}</label>
                <input type="email" value={currentUser?.email && capitalize(currentUser.email)} name="email" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                <button type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary mb-10 self-center">{t('buttons.save')}</button>

                <span className="font-medium text-2xl pb-4">{t('userAuthForm.editpassword')}</span>
                <label htmlFor="password" className='pl-3 font-semibold'>{t('userAuthForm.oldpassword')}</label>
                <input type="password" name="password" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="newPassword" className='pl-3 font-semibold'>{t('userAuthForm.newpassword')}</label>
                <input type="password" name="newPassword" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                <label htmlFor="confirmPassword" className='pl-3 font-semibold'>{t('userAuthForm.confirmpassword')}</label>
                <input type="password" name="confirmPassword" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                <button type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary mb-10 self-center">{t('buttons.save')}</button>
            </div>
        </div >
    )
}

export default Profile
