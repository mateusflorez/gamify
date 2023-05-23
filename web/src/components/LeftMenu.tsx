import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import Logout from './Logout'
import { BiHome } from 'react-icons/bi';

function LeftMenu({ currentPage }: { currentPage: String }) {
    const { t } = useTranslation()

    return (
        <div className='h-screen py-4 grid grid-rows-[15%_70%_15%]'>
            <div className="flex items-center justify-center gap-4">
                <Link to={"/"} className="font-bold text-xl" >{t('title')}</Link>
            </div>
            <div className="flex gap-4">
                <Link
                    to={"/dashboard"}
                    className={`${currentPage === "dashboard"
                        ? "text-violet-500 font-bold bg-bg-darken"
                        : "text-text-secondary font-medium"
                        } flex flex-row items-center justify-center gap-2 cursor-pointer hover:text-violet-600 w-full h-8`}
                >
                    <BiHome />
                    {t('pages.home')}
                </Link>
            </div>
            <div className="flex items-center justify-center">
                <Logout />
            </div>
        </div >
    )
}

export default LeftMenu
