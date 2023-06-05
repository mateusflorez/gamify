import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer, ToastOptions } from "react-toastify"
import axios from 'axios'

import UserImage from '../../../public/assets/dashboard/temp-user-img.png'
import { missionRoute } from '../../utils/APIRoutes'
import { Box, Button, Checkbox, Modal, ThemeProvider, ToggleButton, ToggleButtonGroup, createTheme } from '@mui/material'
import { BiPlus } from 'react-icons/bi'

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface ThemeOptions {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        neutral: Palette['primary'];
    }

    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }

    interface PaletteColor {
        darker?: string;
    }

    interface SimplePaletteColorOptions {
        darker?: string;
    }
}

function Dashboard() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()

    const [missions, setMissions] = useState<any>([])

    const [open, setOpen] = React.useState(false)

    const [values, setValues] = useState({
        name: "",
        description: "",
        difficulty: "",
        frequency: ""
    })

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

    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#6132B4',
                darker: '#39206B',
            },
            neutral: {
                main: '#64748B',
                contrastText: '#d7d7d7',
            },
        },
    });

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

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function handleChangeStatus(mission: any) {
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

    async function handleSave(e: any) {
        e.preventDefault()
        if (handleValidation()) {
            const { name, description, difficulty, frequency } = values

            var experience
            if (difficulty == "1")
                experience = 150
            if (difficulty == "2")
                experience = 300
            if (difficulty == "3")
                experience = 600
            if (difficulty == "4")
                experience = 900

            const request = await axios.post(`${missionRoute}/${currentUser.id}`, {
                name,
                description,
                difficulty: parseInt(difficulty),
                type: parseInt(frequency),
                experience
            })
            if (request.data.status == false) {
                toast.error(`${t(request.data.message)}`, toastOptions)
            } else {
                handleOpen
            }
        }
    }

    function handleValidation() {
        const { name, description, difficulty, frequency } = values

        if (name === "" || description === "" || parseInt(difficulty) < 1 || parseInt(frequency) < 1) {
            toast.error(`${t('validation.nodata')}`, toastOptions)
            return false
        }
        return true

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
                    <span className="font-medium text-2xl">{t('titles.unique')}</span>
                    <button onClick={handleOpen} className="flex justify-center items-center p-1 rounded h-6 w-6 bg-green-500 border-none cursor-pointer hover:bg-green-600">
                        <BiPlus className="text-lg text-white" />
                    </button>
                </div>
                {
                    missions && missions.map((mission: any, index: any) => {
                        if (mission.type === 1) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChangeStatus(mission) }}
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
                <span className="font-medium text-2xl pt-8">{t('titles.daily')}</span>
                {
                    missions && missions.map((mission: any, index: any) => {
                        if (mission.type === 2) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChangeStatus(mission) }}
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
                        if (mission.type === 3) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChangeStatus(mission) }}
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
                        if (mission.type === 4) {
                            return (

                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[10%_90%]'>
                                        <div>
                                            <Checkbox
                                                checked={mission.status ? false : true}
                                                onClick={(e) => { e.stopPropagation(); handleChangeStatus(mission) }}
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
                        <span className="font-medium text-2xl pb-4">{t("titles.newmission")}</span>
                        <label htmlFor="name" className='pl-3 pb-2 font-semibold'>{t("mission.name")}</label>
                        <input type="text" name="name" className="bg-stroke p-4 rounded-3xl w-1/2 h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label htmlFor="description" className='pl-3 pb-2 font-semibold'>{t("mission.description")}</label>
                        <textarea rows={4} name="description" className="bg-stroke p-4 rounded-3xl w-full focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label htmlFor="name" className='pl-3 font-semibold'>{t("mission.difficulty.title")}</label>
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={values.difficulty}
                                exclusive
                                onChange={e => handleChange(e)}
                                aria-label="Platform"
                                className='p-4'
                            >
                                <ToggleButton name="difficulty" value="1">{t("mission.difficulty.simple")}</ToggleButton>
                                <ToggleButton name="difficulty" value="2">{t("mission.difficulty.easy")}</ToggleButton>
                                <ToggleButton name="difficulty" value="3">{t("mission.difficulty.medium")}</ToggleButton>
                                <ToggleButton name="difficulty" value="4">{t("mission.difficulty.hard")}</ToggleButton>
                            </ToggleButtonGroup>
                        </ThemeProvider>
                        <label htmlFor="name" className='pl-3 font-semibold'>{t("mission.frequency.title")}</label>
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={values.frequency}
                                exclusive
                                onChange={e => handleChange(e)}
                                aria-label="Platform"
                                className='p-4 mb-4'
                            >
                                <ToggleButton name="frequency" value="1">{t("mission.frequency.once")}</ToggleButton>
                                <ToggleButton name="frequency" value="2">{t("mission.frequency.daily")}</ToggleButton>
                                <ToggleButton name="frequency" value="3">{t("mission.frequency.weekly")}</ToggleButton>
                                <ToggleButton name="frequency" value="4">{t("mission.frequency.monthly")}</ToggleButton>
                            </ToggleButtonGroup>
                        </ThemeProvider>
                        <button onClick={e => handleSave(e)} type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary self-center">{t('buttons.save')}</button>
                    </div>
                </Box>
            </Modal>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Dashboard
