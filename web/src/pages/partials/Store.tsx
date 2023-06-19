import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import { BiCoin, BiPlus } from 'react-icons/bi'
import { itemRoute } from '../../utils/APIRoutes'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Modal, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { modalStyle, theme, toastOptions } from '../../utils/utils'
import ItemImage from '../../../public/assets/dashboard/temp-item-img.png'

function Store() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()
    const [items, setItems] = useState<any>([])
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        upload_file: "",
        id: ""
    })

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (user) {
            setCurrentUser(await JSON.parse(user))
        }
    }

    const getItems = async () => {
        const response = await axios.get(`${itemRoute}/${currentUser.id}`)
        setItems(response.data)
    }

    useEffect(() => {
        getItems()
    }, [currentUser])

    useEffect(() => {
        checkCurrentUser()
    }, [])

    const handleOpen = () => {
        setValues({
            name: "",
            description: "",
            price: "",
            upload_file: "",
            id: ""
        })
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    function handleChange(e: any) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    function handleChangeFile(e: { target: HTMLInputElement }) {
        const file = e.target.files ? e.target.files[0] : ""
        const allowedExtensions = /(\.jpg|\.png)$/i;

        if (!allowedExtensions.exec(file && file.name)) {
            toast.error(`${t("validation.invalidextension")}`, toastOptions)
            return;
        }

        setValues({
            ...values,
            [e.target.name]: e.target.files ? e.target.files[0] : ""
        })
    }

    async function handleSave(e: React.MouseEvent) {
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
        // const { name, description, difficulty, frequency, id } = values

        // const loot = calculatePrice(difficulty);

        // const request = await axios.put(`${missionRoute}/${currentUser.id}/${id}`, {
        //     name,
        //     description,
        //     difficulty: parseInt(difficulty),
        //     type: parseInt(frequency),
        //     experience: loot.experience,
        //     gold: loot.gold
        // })

        // if (request.data.status == false) {
        //     toast.error(`${t(request.data.message)}`, toastOptions)
        // } else {
        //     handleClose()
        //     getMissions()
        //     toast.success(`${t("success.updatemission")}`, toastOptions)
        // }
    }

    async function saveNewMission() {
        const { name, description, price, upload_file } = values

        const newPrice = calculatePrice(price);

        const formData = new FormData();
        formData.append("image", upload_file)
        formData.append("price", newPrice)
        formData.append("description", description)
        formData.append("name", name)

        const request = await axios.post(`${itemRoute}/${currentUser.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })

        if (request.data.status == false) {
            toast.error(`${t(request.data.message)}`, toastOptions)
        } else {
            handleClose()
            getItems()
            toast.success(`${t("success.newitem")}`, toastOptions)
        }
    }

    function calculatePrice(price: string) {
        let newPrice

        if (price === "1") {
            newPrice = "45"
        } else if (price === "2") {
            newPrice = "90"
        } else if (price === "3") {
            newPrice = "180"
        } else if (price === "4") {
            newPrice = "270"
        } else {
            newPrice = "0"
        }

        return newPrice
    }

    function handleValidation() {
        const { name, price, upload_file } = values

        if (name === "" || parseInt(price) < 1) {
            toast.error(`${t('validation.nodata')}`, toastOptions)
            return false
        }
        if (!upload_file) {
            toast.error(`${t('validation.noimage')}`, toastOptions)
            return false
        }
        return true
    }

    return (
        <div className="flex flex-col w-full p-8">
            <div className='flex flex-row items-center gap-2 mb-4'>
                <span className='font-medium pr-2'>{t("stats.wallet")}:</span><span className='text-[#c69708]'><BiCoin /></span> {currentUser?.gold}
            </div>
            <div className='flex flex-row gap-4 items-center w-11/12 pb-8'>
                <span className="font-medium text-2xl">{t('titles.items')}</span>
                <button onClick={() => handleOpen()} className="flex justify-center items-center p-1 rounded h-6 w-6 bg-green-500 border-none cursor-pointer hover:bg-green-600">
                    <BiPlus className="text-lg text-white" />
                </button>
            </div>
            <div className='grid grid-cols-4 gap-4'>
                {
                    items.length > 0 ? (
                        items.map((item: any, index: number) => {
                            return (
                                <Card >
                                    <CardMedia
                                        component="img"
                                        alt="item picture"
                                        sx={{ height: "140px" }}
                                        image={item?.image ? "images/item/" + item.image : ItemImage}
                                    />
                                    <CardContent
                                        className='mx-2 grid grid-cols-2'
                                    >
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                        <Typography gutterBottom variant="h5" component="div" className='text-end'>
                                            <div className="flex flex-row justify-end items-center gap-1">
                                                <span className='text-[#c69708]'><BiCoin /></span>{item.price}
                                            </div>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description.length > 12 ?
                                                <span title={item.description} className='no-underline'>{item.description.substring(0, 12)}...</span>
                                                :
                                                <span>{item.description}</span>
                                            }
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className='grid grid-cols-3 justify-evenly'
                                    >
                                        <Button size="small" color='primary'>{t("buttons.edit")}</Button>
                                        <Button size="small" color='success'>{t("buttons.buy")}</Button>
                                        <Button size="small" color='error'>{t("buttons.delete")}</Button>
                                    </CardActions>
                                </Card>
                            )
                        })
                    ) : (
                        <div className='bg-white w-5/6 self-center my-4 p-4 rounded-lg'>
                            <div className='flex flex-col'>
                                <span className='text-xl font-medium'>{t('titles.noitems')}</span>
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
                        <span className="font-medium text-2xl pb-4">{t(values.id ? "titles.edititem" : "titles.newitem")}</span>
                        <label htmlFor="name" className='pl-3 pb-2 font-semibold'>{t("item.name")}</label>
                        <input type="text" value={values.name} name="name" className="bg-stroke p-4 rounded-3xl w-1/2 h-10 focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label htmlFor="description" className='pl-3 pb-2 font-semibold'>{t("item.description")}</label>
                        <textarea rows={4} value={values.description} name="description" className="bg-stroke p-4 rounded-3xl w-full focus:bg-bg-darken transition mb-4" onChange={e => handleChange(e)} />
                        <label className='pl-3 font-semibold'>{t("item.price.title")}</label>
                        <ThemeProvider theme={theme}>
                            <ToggleButtonGroup
                                color="primary"
                                value={values.price}
                                exclusive
                                onChange={e => handleChange(e)}
                                aria-label="Platform"
                                className='p-4'
                            >
                                <ToggleButton name="price" value="1">{t("item.price.simple")}</ToggleButton>
                                <ToggleButton name="price" value="2">{t("item.price.cheap")}</ToggleButton>
                                <ToggleButton name="price" value="3">{t("item.price.medium")}</ToggleButton>
                                <ToggleButton name="price" value="4">{t("item.price.expensive")}</ToggleButton>
                            </ToggleButtonGroup>
                        </ThemeProvider>
                        <label className='pl-3 pb-2 font-semibold'>{t("item.image")}</label>
                        <input type="file" name="upload_file" onChange={e => handleChangeFile(e)} className="mb-8 w-min relative m-0 block min-w-0 flex-auto rounded-3xl border border-solid border-neutral-300 bg-stroke px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none" />
                        <button onClick={e => handleSave(e)} type="button" className="bg-accent-secondary rounded-3xl font-bold text-white h-10 w-56 border-none cursor-pointer transition hover:bg-accent-primary self-center">{t('buttons.save')}</button>
                    </div>
                </Box>
            </Modal>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Store
