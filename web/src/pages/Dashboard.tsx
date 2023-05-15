import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Banner1 from '../assets/dashboard/1.png'
import UserImage from '../assets/dashboard/temp-user-img.png'

function Dashboard() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    useEffect(() => {
        const checkCurrentUser = async () => {
            const user = localStorage.getItem('user')
            if (user)
                setCurrentUser(await JSON.parse(user).user)
        }
        checkCurrentUser()
    }, [])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex flex-col justify-center items-center gap-4" >
                <img className='w-full' src={Banner1} alt="Banner" />
            </div>
            <div className='w-5/6' style={{ marginTop: '-5rem' }}>
                <img className='w-36' src={UserImage} alt="User image" />
            </div>
            <div className='w-5/6 pt-16'>
                <h1 className="text-white font-bold text-4xl">{currentUser?.username && capitalize(currentUser.username)} - {currentUser?.profession && capitalize(currentUser.profession)} - {currentUser?.level}<span className='bg-rainbow-gradient text-transparent bg-clip-text'></span></h1>
            </div>
        </div >
    )
}

export default Dashboard
