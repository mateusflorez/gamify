import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import { BiPlus, BiShoppingBag } from 'react-icons/bi'
import { itemRoute} from '../../utils/APIRoutes'
import { useTranslation } from 'react-i18next'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { toastOptions } from '../../utils/utils'
import ItemImage from '../../../public/assets/dashboard/temp-item-img.png'
import { Link } from 'react-router-dom'

function Inventory() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()
    const [items, setItems] = useState<any>([])

    const inventory = items && items.filter((item: any) => item.quantity > 0)

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

    async function handleUse(item: any) {
        const requestMission = await axios.put(`${itemRoute}/${currentUser.id}/${item.id}`, {
            "quantity": item.quantity - 1
        })
        if (requestMission.data.status == false) {
            toast.error(`${t(requestMission.data.message)}`, toastOptions)
        }

        getItems()
    }

    return (
        <div className="flex flex-col w-full p-8">
            <div className='flex flex-row gap-4 items-center w-11/12 pb-8'>
                <span className="font-medium text-2xl">{t('titles.inventory')}</span>
                <Link
                    to={"/store"}
                >
                    <button className="flex justify-center items-center p-1 rounded h-6 w-6 bg-green-500 border-none cursor-pointer hover:bg-green-600">
                        <BiPlus className="text-lg text-white" />
                    </button>
                </Link>
            </div>
            <div className='grid grid-cols-3 gap-4'>
                {
                    inventory.length > 0 ? (
                        inventory.map((item: any) => {
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
                                                <span className='text-[#0D6EFD]'><BiShoppingBag /></span>{item.quantity}
                                            </div>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description.length > 12 ?
                                                <span title={item.description} className='no-underline'>{item.description.substring(0, 22)}...</span>
                                                :
                                                <span>{item.description}</span>
                                            }
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className='grid grid-cols-3 justify-evenly'
                                    >
                                        <Button size="small" color='primary' onClick={(e) => { e.stopPropagation(); handleUse(item) }}>{t("buttons.use")}</Button>
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
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Inventory
