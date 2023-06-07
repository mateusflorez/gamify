import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import LeftMenu from "../components/LeftMenu"
import Dashboard from "./partials/Dashboard"
import Profile from "./partials/Profile"

const PAGES: { [key: string]: any } = {
    "dashboard": <Dashboard />,
    "profile": <Profile />
}

function Static({ page }: { page: string }) {
    const [pageSelected, setPageSelected] = useState<String>("dashboard")
    const [currentUser, setCurrentUser] = useState<any>()

    const location = useLocation()
    const navigate = useNavigate()

    const checkCurrentUser = async () => {
        const user = localStorage.getItem('user')
        if (!user) {
            navigate('/login')
        } else {
            if (JSON.parse(user).profession == "") {
                navigate('/welcome')
            }
        }
    }

    useEffect(() => {
        checkCurrentUser()
    }, [])

    useEffect(() => {
        setPageSelected(page)
    }, [location, page])

    return (
        <div className="bg-dark grid grid-cols-[20%_80%] items-center">
            <LeftMenu currentPage={pageSelected} />

            <div className="flex flex-col items-center overflow-auto scrollbar h-screen bg-bg-darken">
                {PAGES[page]}
            </div>

        </div>
    )
}

export default Static
