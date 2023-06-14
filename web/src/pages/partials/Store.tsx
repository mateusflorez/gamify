import axios from 'axios'
import { useEffect, useState } from 'react'
import { BiCoin } from 'react-icons/bi'
import { itemRoute } from '../../utils/APIRoutes'

function Store() {
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
        setItems(response.data.items)
    }

    useEffect(() => {
        getItems()
    }, [currentUser])

    useEffect(() => {
        checkCurrentUser()
    }, [])

    return (
        <div className="flex flex-col w-full p-8">
            <div className='flex flex-row items-center gap-2'>
                <span className='text-[#c69708]'><BiCoin /></span> {currentUser?.gold}
            </div>
        </div>
    )
}

export default Store
