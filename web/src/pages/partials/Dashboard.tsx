import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer, ToastOptions } from "react-toastify"
import axios from 'axios'

import UserImage from '../../../public/assets/dashboard/temp-user-img.png'
import { missionRoute } from '../../utils/APIRoutes'
import { Box, Button, Checkbox, Modal } from '@mui/material'
import { BiPlus } from 'react-icons/bi'

function Dashboard() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    const [missions, setMissions] = useState<any>([])

    const [open, setOpen] = React.useState(false)

    const toastOptions: ToastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        theme: 'dark'
    }

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        "border-radius": '15px',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

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

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
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
                <div className='flex flex-row justify-between w-11/12'>
                    <span className="font-medium text-2xl">{t('titles.daily')}</span>
                    <button onClick={handleOpen} className="flex justify-center items-center p-1 rounded h-6 w-6 bg-green-500 border-none cursor-pointer hover:bg-green-600">
                        <BiPlus className="text-lg text-white" />
                    </button>
                </div>
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
                <span className="font-medium text-2xl pt-8">{t('titles.weekly')}</span>
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
                <span className="font-medium text-2xl pt-8">{t('titles.weekly')}</span>
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...modalStyle, width: "60%" }}>
                    <div className='flex flex-col'>
                        <span>New mission</span>
                        <span>
                            Name
                        </span>
                        <span>
                            Description
                        </span>
                        <span>
                            Difficulty
                        </span>
                        <span>
                            Frequency
                        </span>
                    </div>
                </Box>
            </Modal>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Dashboard
