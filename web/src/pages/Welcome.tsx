import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { updateUserRoute } from "../utils/APIRoutes"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from 'react-i18next'
import { toastOptions } from '../utils/utils'

function Welcome() {
    const [values, setValues] = useState({
        profession: ""
    })

    const [currentUser, setCurrentUser] = useState<any>()

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(await JSON.parse(user))
        }
    }

    const navigate = useNavigate()

    const { t } = useTranslation()

    useEffect(() => {
        checkCurrentUser()
    }, [])

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        if (handleValidation()) {
            const { profession } = values
            const request = await axios.put(`${updateUserRoute}/${currentUser.id}`, {
                "user": {
                    "profession": profession
                }
            })
            if (request.data.status == false) {
                toast.error(`${t(request.data.message)}`, toastOptions)
            } else {
                localStorage.setItem('user', JSON.stringify(request.data.user))
                navigate("/")
            }
        }
    }

    function handleValidation() {
        const { profession } = values
        if (profession == "") {
            toast.error(`${t('validation.noprofession')}`, toastOptions)
            return false
        }
        return true
    }

    return (
        <div className="h-screen w-screen bg-bg-light">
            <div className="grid grid-cols-2">
                <div className='h-screen flex items-center justify-center'>
                    <form className="flex flex-col px-32 w-full" onSubmit={(e) => { handleSubmit(e) }}>
                        <p className='font-bold text-2xl pb-10 self-center'>{t('title')}</p>
                        <p className='font-bold text-xl pb-10 self-center'>{t('welcome.title')}<span className='text-accent-secondary'>{currentUser?.username}</span></p>
                        <p className='font-bold text-justify text-xl pb-10 self-center'>{t('welcome.text1')}</p>
                        <p className='font-bold text-justify text-xl pb-10 self-center'>{t('welcome.text2')}</p>
                        <label htmlFor="profession" className='pl-3 font-semibold'>{t('userAuthForm.profession')}</label>
                        <input type="text" name="profession" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                        <button type="submit" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 border-none cursor-pointer transition hover:bg-accent-primary mb-4">{t('buttons.save')}</button>
                    </form>
                </div>
                <div className='h-screen bg-auth-background bg-no-repeat bg-cover rounded-l-3xl'></div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Welcome
