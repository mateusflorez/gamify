import { useNavigate } from "react-router-dom"
import { BiPowerOff } from "react-icons/bi"
import { useTranslation } from 'react-i18next';

function Logout() {
    const navigate = useNavigate()

    const { t } = useTranslation()

    function handleClick() {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <button onClick={() => handleClick()} className="py-1 px-2 rounded bg-bg-darken border-none cursor-pointer hover:bg-stroke">
            <div className="text-lg flex items-center gap-2"><BiPowerOff />{t('buttons.logout')}</div>
        </button>
    )
}

export default Logout
