import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import UserImage from '../../../public/assets/dashboard/temp-user-img.png'

function Dashboard() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

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

    return (
        <div className="flex flex-col w-full">
            <div className='p-8 flex flex-row gap-8'>
                <img className='w-60' src={UserImage} alt="User image" />
                <div className=''>
                    <span className="font-bold text-4xl">{currentUser?.username && capitalize(currentUser.username)} - {currentUser?.profession && capitalize(currentUser.profession)} - {currentUser?.level}<span className='bg-rainbow-gradient text-transparent bg-clip-text'></span></span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
