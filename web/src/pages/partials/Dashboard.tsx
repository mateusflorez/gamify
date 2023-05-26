import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer, ToastOptions } from "react-toastify"
import axios from 'axios'

import UserImage from '../../../public/assets/dashboard/temp-user-img.png'
import { missionRoute } from '../../utils/APIRoutes'
import { Checkbox } from '@mui/material'

function Dashboard() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    const [missions, setMissions] = useState<any>([])

    const toastOptions: ToastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        theme: 'dark'
    }

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(await JSON.parse(user))
            getMissions(user)
        }
    }

    const getMissions = async (user: any) => {
        const response = await axios.get(`${missionRoute}/${(JSON.parse(user)).id}`)
        setMissions(response.data)
    }

    useEffect(() => {
        checkCurrentUser()
    }, [])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function handleChange(mission: any) {
        const newStatus = !mission.status
        const request = await axios.put(`${missionRoute}/${currentUser.id}/${mission.id}`, {
            "mission": {
                "status": newStatus
            }
        })
        if (request.data.status == false) {
            toast.error(`${t(request.data.message)}`, toastOptions)
        }
        checkCurrentUser()
    }

    return (
        <div className="flex flex-col w-full">
            <div className='p-8 flex flex-row gap-8'>
                <img className='w-60' src={UserImage} alt="User image" />
                <div className=''>
                    <span className="font-bold text-4xl">{currentUser?.username && capitalize(currentUser.username)} - {currentUser?.profession && capitalize(currentUser.profession)} - {currentUser?.level}<span className='bg-rainbow-gradient text-transparent bg-clip-text'></span></span>
                </div>
            </div>
            <div className='flex flex-col px-8'>
                <span className="font-medium text-2xl pb-4">{t('titles.daily')}</span>
                {
                    missions && missions.map((mission: any, index: any) => {
                        if (mission.type === 3) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChange(mission) }}
                                                name='inspiration'
                                                style={{
                                                    color: "#6132B4"
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 40 }
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-xl font-medium'>{mission.name}</span>
                                            <span>{mission.description}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
                }
                <span className="font-medium text-2xl pb-4 pt-8">{t('titles.weekly')}</span>
                {
                    missions && missions.map((mission: any, index: any) => {
                        if (mission.type === 2) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChange(mission) }}
                                                name='inspiration'
                                                style={{
                                                    color: "#6132B4"
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 40 }
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-xl font-medium'>{mission.name}</span>
                                            <span>{mission.description}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
                }
                <span className="font-medium text-2xl pb-4 pt-8">{t('titles.weekly')}</span>
                {
                    missions && missions.map((mission: any, index: any) => {
                        if (mission.type === 1) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChange(mission) }}
                                                name='inspiration'
                                                style={{
                                                    color: "#6132B4"
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 40 }
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-xl font-medium'>{mission.name}</span>
                                            <span>{mission.description}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Dashboard
