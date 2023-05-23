import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import LeftMenu from "../components/LeftMenu"
import Dashboard from "./Dashboard"

const PAGES: { [key: string]: any } = {
    "dashboard": <Dashboard />
}

function Static({ page }: { page: string }) {
    const [pageSelected, setPageSelected] = useState<String>("dashboard")
    const [currentUser, setCurrentUser] = useState<any>()

    const location = useLocation()
    const navigate = useNavigate()

    // useEffect(() => {
    //     const checkCurrentUser = async () => {
    //         const user = localStorage.getItem('user')
    //         if (!user) {
    //             navigate('/login')
    //         } else {
    //             setCurrentUser(await JSON.parse(user).user)
    //         }
    //     }
    //     checkCurrentUser()
    // }, [])

    useEffect(() => {
        const getAllUsers = async () => {
            if (currentUser) {
                if (currentUser.profession == "") {
                    navigate('/welcome')
                }
            }
        }
        getAllUsers()
    }, [pageSelected, currentUser])

    useEffect(() => {
        setPageSelected(page)
    }, [location, page])

    return (
        <div className="bg-dark grid grid-cols-[20%_80%] items-center">
            <LeftMenu currentPage={pageSelected} />

            <div className="flex flex-col items-center overflow-auto scrollbar">
                {PAGES[page]}
            </div>

        </div>
    )
}

export default Static
