import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from "react-toastify"
import axios from 'axios'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import UserImage from '../../../public/assets/dashboard/temp-user-img.png'
import { missionRoute, updateUserRoute } from '../../utils/APIRoutes'
import { Box, Checkbox, Modal, ThemeProvider, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { BiEdit, BiPlus, BiTrash } from 'react-icons/bi'
import { modalStyle, theme, toastOptions } from '../../utils/utils'

function Dashboard() {
    const { t } = useTranslation()

    const MySwal = withReactContent(Swal)

    const [currentUser, setCurrentUser] = useState<any>()

    const [missions, setMissions] = useState<any>([])

    const [open, setOpen] = React.useState(false)

    const [values, setValues] = useState({
        name: "",
        description: "",
        difficulty: "",
        frequency: "",
        id: ""
    })

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(await JSON.parse(user))
        }
    }

    const getMissions = async () => {
        const response = await axios.get(`${missionRoute}/${currentUser.id}`)
        setMissions(response.data)
    }

    const handleOpen = () => {
        setValues({
            name: "",
            description: "",
            difficulty: "",
            frequency: "",
            id: ""
        })
        setOpen(true)
    }

    const handleEdit = (mission: any) => {
        setValues({
            name: mission.name,
            description: mission.description,
            difficulty: mission.difficulty.toString(),
            frequency: mission.type.toString(),
            id: mission.id
        })
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        getMissions()
    }, [currentUser])

    useEffect(() => {
        checkCurrentUser()
    }, [])

    const uniqueMissions = missions && missions.filter((mission: any) => mission.type === 1 && mission.status)
    const dailyMissions = missions && missions.filter((mission: any) => mission.type === 2 && mission.status)
    const weeklyMissions = missions && missions.filter((mission: any) => mission.type === 3 && mission.status)
    const monthlyMissions = missions && missions.filter((mission: any) => mission.type === 4 && mission.status)

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    async function handleChangeStatus(mission: any) {
        const newStatus = !mission.status
        const requestMission = await axios.put(`${missionRoute}/${currentUser.id}/${mission.id}`, {
            "mission": {
                "status": newStatus
            }
        })
        if (requestMission.data.status == false) {
            toast.error(`${t(requestMission.data.message)}`, toastOptions)
        }
        let userData
        let newExperience
        if (!mission.status) {
            newExperience = currentUser.experience - mission.experience
            userData = {
                user: {
                    experience: newExperience,
                    completedMissions: currentUser.completedMissions - 1,
                    level: Math.floor(newExperience / 3000) + 1
                }
            }
        } else {
            newExperience = currentUser.experience + mission.experience
            userData = {
                user: {
                    experience: newExperience,
                    completedMissions: currentUser.completedMissions + 1,
                    level: Math.floor(newExperience / 3000) + 1
                }
            }
        }
        const requestUser = await axios.put(`${updateUserRoute}/${currentUser.id}`, userData)
        if (requestUser.data.status == false) {
            toast.error(`${t(requestUser.data.message)}`, toastOptions)
        } else {
            localStorage.setItem('user', JSON.stringify(requestUser.data.user))
            const user = localStorage.getItem('user')
            if (user)
                setCurrentUser(await JSON.parse(user))
        }
        checkCurrentUser()
    }

    async function handleDelete(mission: any) {
        MySwal.fire({
            title: `${t('texts.delete.rusure')}`,
            text: `${t('texts.delete.alert')}`,
            icon: "warning",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'Cancel',
            confirmButtonColor: '#6132B4',
            denyButtonColor: '#6B6B5B'
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`${missionRoute}/${currentUser.id}/${mission.id}`)
                    getMissions()
                    return MySwal.fire({
                        text: `${t('success.deletemission')}`,
                        icon: "success",
                        confirmButtonColor: '#6132B4'
                    })
                } else {
                    return MySwal.fire({
                        text: `${t('texts.delete.nodelete')}`,
                        icon: "info",
                        confirmButtonColor: '#6132B4'
                    })
                }
            })
    }

    async function handleSave(e: any) {
        e.preventDefault()
        if (handleValidation()) {
            const { id } = values

            if (id == "") {
                saveNewMission()
            } else {
                updateMission()
            }

        }
    }

    async function updateMission() {
        const { name, description, difficulty, frequency, id } = values

        const experience = calculateExperience(difficulty);

        const request = await axios.put(`${missionRoute}/${currentUser.id}/${id}`, {
            mission: {
                name,
                description,
                difficulty: parseInt(difficulty),
                type: parseInt(frequency),
                experience
            }

        })

        if (request.data.status == false) {
            toast.error(`${t(request.data.message)}`, toastOptions)
        } else {
            handleClose()
            getMissions()
            toast.success(`${t("success.updatemission")}`, toastOptions)
        }
    }

    async function saveNewMission() {
        const { name, description, difficulty, frequency } = values

        const experience = calculateExperience(difficulty);

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
            handleClose()
            getMissions()
            toast.success(`${t("success.newmission")}`, toastOptions)
        }
    }

    function calculateExperience(difficulty: string) {
        let experience;

        if (difficulty === "1")
            experience = 150;
        else if (difficulty === "2")
            experience = 300;
        else if (difficulty === "3")
            experience = 600;
        else if (difficulty === "4")
            experience = 900;

        return experience;
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
                    uniqueMissions.length > 0 ? (
                        uniqueMissions.map((mission: any, index: any) => {
                            return (
                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[15%_70%_15%]'>
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
                                        <div className='flex flex-row gap-2 justify-center items-center'>
                                            <span className='text-2xl font-medium text-blue-400 cursor-pointer hover:text-blue-700'
                                                onClick={(e) => { e.stopPropagation(); handleEdit(mission) }}>
                                                <BiEdit />
                                            </span>
                                            <span className='text-2xl font-medium text-red-400 cursor-pointer hover:text-red-700'
                                                onClick={(e) => { e.stopPropagation(); handleDelete(mission) }}>
                                                <BiTrash />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg'>
                            <div className='flex flex-col'>
                                <span className='text-xl font-medium'>{t('titles.nomissions')}</span>
                            </div>
                        </div>
                    )
                }
                <span className="font-medium text-2xl pt-8">{t('titles.daily')}</span>
                {
                    dailyMissions.length > 0 ? (
                        dailyMissions.map((mission: any, index: any) => {
                            return (
                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[15%_70%_15%]'>
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
                                        <div className='flex flex-row gap-2 justify-center items-center'>
                                            <span className='text-2xl font-medium text-blue-400 cursor-pointer hover:text-blue-700'
                                                onClick={(e) => { e.stopPropagation(); handleEdit(mission) }}>
                                                <BiEdit />
                                            </span>
                                            <span className='text-2xl font-medium text-red-400 cursor-pointer hover:text-red-700'
                                                onClick={(e) => { e.stopPropagation(); handleDelete(mission) }}>
                                                <BiTrash />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg'>
                            <div className='flex flex-col'>
                                <span className='text-xl font-medium'>{t('titles.nomissions')}</span>
                            </div>
                        </div>
                    )
                }
                <span className="font-medium text-2xl pt-8">{t('titles.weekly')}</span>
                {
                    weeklyMissions.length > 0 ? (
                        weeklyMissions.map((mission: any, index: any) => {
                            return (
                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[15%_70%_15%]'>
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
                                        <div className='flex flex-row gap-2 justify-center items-center'>
                                            <span className='text-2xl font-medium text-blue-400 cursor-pointer hover:text-blue-700'
                                                onClick={(e) => { e.stopPropagation(); handleEdit(mission) }}>
                                                <BiEdit />
                                            </span>
                                            <span className='text-2xl font-medium text-red-400 cursor-pointer hover:text-red-700'
                                                onClick={(e) => { e.stopPropagation(); handleDelete(mission) }}>
                                                <BiTrash />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg'>
                            <div className='flex flex-col'>
                                <span className='text-xl font-medium'>{t('titles.nomissions')}</span>
                            </div>
                        </div>
                    )
                }
                <span className="font-medium text-2xl pt-8">{t('titles.monthly')}</span>
                {
                    monthlyMissions.length > 0 ? (
                        monthlyMissions.map((mission: any, index: any) => {
                            return (
                                <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg' key={index}>
                                    <div className='grid grid-cols-[15%_70%_15%]'>
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
                                        <div className='flex flex-row gap-2 justify-center items-center'>
                                            <span className='text-2xl font-medium text-blue-400 cursor-pointer hover:text-blue-700'
                                                onClick={(e) => { e.stopPropagation(); handleEdit(mission) }}>
                                                <BiEdit />
                                            </span>
                                            <span className='text-2xl font-medium text-red-400 cursor-pointer hover:text-red-700'
                                                onClick={(e) => { e.stopPropagation(); handleDelete(mission) }}>
                                                <BiTrash />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg'>
                            <div className='flex flex-col'>
                                <span className='text-xl font-medium'>{t('titles.nomissions')}</span>
                            </div>
                        </div>
                    )
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
                        <input type="text" value={values.id} className='hidden' name="id" onChange={e => handleChange(e)} />
                        <span className="font-medium text-2xl pb-4">{t("titles.newmission")}</span>
                        <label htmlFor="name" className='pl-3 pb-2 font-semibold'>{t("mission.name")}</label>
                        <input type="text" value={values.name} name="name" className="bg-stroke p-4 rounded-3xl w-1/2 h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label htmlFor="description" className='pl-3 pb-2 font-semibold'>{t("mission.description")}</label>
                        <textarea rows={4} value={values.description} name="description" className="bg-stroke p-4 rounded-3xl w-full focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label className='pl-3 font-semibold'>{t("mission.difficulty.title")}</label>
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={values.difficulty}
                                exclusive
                                onChange={e => handleChange(e)}
                                aria-label="Platform"
                                className='p-4'
                                defaultValue={values.difficulty}
                            >
                                <ToggleButton name="difficulty" value="1">{t("mission.difficulty.simple")}</ToggleButton>
                                <ToggleButton name="difficulty" value="2">{t("mission.difficulty.easy")}</ToggleButton>
                                <ToggleButton name="difficulty" value="3">{t("mission.difficulty.medium")}</ToggleButton>
                                <ToggleButton name="difficulty" value="4">{t("mission.difficulty.hard")}</ToggleButton>
                            </ToggleButtonGroup>
                        </ThemeProvider>
                        <label className='pl-3 font-semibold'>{t("mission.frequency.title")}</label>
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={values.frequency}
                                exclusive
                                onChange={e => handleChange(e)}
                                aria-label="Platform"
                                className='p-4 mb-4'
                                defaultValue={values.frequency}
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
