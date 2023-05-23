import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer, ToastOptions } from "react-toastify"
import { loginRoute } from "../utils/APIRoutes"
import axios from "axios"
import Logo from '../assets/d20.png'
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from 'react-i18next'

function Login() {
    const toastOptions: ToastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        theme: 'dark'
    }

    const [values, setValues] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate()

    const { t } = useTranslation()

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate("/")
        }
    }, [])

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        if (handleValidation()) {
            const { password, username } = values
            const request = await axios.post(loginRoute, {
                username,
                password
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
        const { password, username } = values
        if (username == "") {
            toast.error(`${t('validation.nousername')}`, toastOptions)
            return false
        }
        if (password == "") {
            toast.error(`${t('validation.nopassword')}`, toastOptions)
            return false
        }
        return true
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-bg-light">
            <div className="grid grid-cols-2">
                <div className='h-screen'>
                    <form className="flex flex-col px-32 py-[25vh]" onSubmit={(e) => { handleSubmit(e) }}>
                        <p className='font-bold text-2xl pb-10 self-center'>{t('title')}</p>
                        <label htmlFor="username" className='pl-3 font-semibold'>{t('userAuthForm.username')}</label>
                        <input type="text" name="username" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label htmlFor="password" className='pl-3 font-semibold'>{t('userAuthForm.password')}</label>
                        <input type="password" name="password" className="bg-stroke p-4 rounded-3xl w-full h-10 focus:bg-bg-darken transition mb-8" onChange={e => handleChange(e)} />
                        <button type="submit" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 border-none cursor-pointer transition hover:bg-accent-primary">{t('buttons.login')}</button>
                    </form>
                </div>
                <div className='h-screen bg-auth-background bg-no-repeat bg-cover rounded-l-3xl'></div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Login
