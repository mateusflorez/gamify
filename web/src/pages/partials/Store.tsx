import axios from 'axios'
import { useEffect, useState } from 'react'
import { BiCoin } from 'react-icons/bi'
import { itemRoute } from '../../utils/APIRoutes'
import { useTranslation } from 'react-i18next'
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'

function Store() {
    const { t } = useTranslation()

    const [currentUser, setCurrentUser] = useState<any>()
    const [items, setItems] = useState<any>([])

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

    return (
        <div className="flex flex-col w-full p-8">
            <div className='flex flex-row items-center gap-2 mb-4'>
                <span className='font-medium pr-2'>{t("stats.wallet")}:</span><span className='text-[#c69708]'><BiCoin /></span> {currentUser?.gold}
            </div>
            <div className='flex flex-row justify-between w-11/12'>
                <span className="font-medium text-2xl">{t('titles.items')}</span>
            </div>
            <div className='grid grid-cols-4'>
                {
                    items.length > 0 ? (
                        items.map((item: any, index: number) => {
                            return (
                                <Card >
                                    <CardMedia
                                        component="img"
                                        alt="item picture"
                                        sx={{ height: "140px" }}
                                        image="/public/images/1686656389238-icone2.png"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        className='grid grid-cols-3 justify-evenly'
                                    >
                                        <Button size="small">{t("buttons.edit")}</Button>
                                        <Button size="small">{t("buttons.buy")}</Button>
                                        <Button size="small">{t("buttons.delete")}</Button>
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
        </div>
    )
}

export default Store
