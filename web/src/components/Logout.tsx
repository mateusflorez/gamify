import { useNavigate } from "react-router-dom"
import { BiPowerOff } from "react-icons/bi"

function Logout() {
    const navigate = useNavigate()

    function handleClick() {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <button onClick={() => handleClick()} className="py-1 px-2 rounded bg-bg-darken border-none cursor-pointer hover:bg-stroke">
            <div className="text-lg flex items-center gap-2"><BiPowerOff /> Log out</div>
        </button>
    )
}

export default Logout
