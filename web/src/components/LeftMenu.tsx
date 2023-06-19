import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import Logout from './Logout'
import { BiArchive, BiHome, BiStore, BiUser } from 'react-icons/bi';

function LeftMenu({ currentPage }: { currentPage: String }) {
    const { t } = useTranslation()

    return (
        <div className='h-screen py-4 grid grid-rows-[15%_70%_15%]'>
            <div className="flex items-center justify-center gap-4">
                <Link to={"/"} className="font-bold text-xl" >{t('title')}</Link>
            </div>
            <div className="flex flex-col">
                <Link
                    to={"/"}
                    className={`${currentPage === "dashboard"
                        ? "text-accent-primary font-bold bg-bg-darken"
                        : "text-text-secondary font-medium"
                        } flex flex-row items-center justify-center gap-2 cursor-pointer hover:text-accent-secondary hover:bg-stroke w-full h-8`}
                >
                    <BiHome />
                    {t('pages.home')}
                </Link>
                <Link
                    to={"/store"}
                    className={`${currentPage === "store"
                        ? "text-accent-primary font-bold bg-bg-darken"
                        : "text-text-secondary font-medium"
                        } flex flex-row items-center justify-center gap-2 cursor-pointer hover:text-accent-secondary hover:bg-stroke w-full h-8`}
                >
                    <BiStore />
                    {t('pages.store')}
                </Link>
                <Link
                    to={"/inventory"}
                    className={`${currentPage === "inventory"
                        ? "text-accent-primary font-bold bg-bg-darken"
                        : "text-text-secondary font-medium"
                        } flex flex-row items-center justify-center gap-2 cursor-pointer hover:text-accent-secondary hover:bg-stroke w-full h-8`}
                >
                    <BiArchive />
                    {t('pages.inventory')}
                </Link>
                <Link
                    to={"/profile"}
                    className={`${currentPage === "profile"
                        ? "text-accent-primary font-bold bg-bg-darken"
                        : "text-text-secondary font-medium"
                        } flex flex-row items-center justify-center gap-2 cursor-pointer hover:text-accent-secondary hover:bg-stroke w-full h-8`}
                >
                    <BiUser />
                    {t('pages.profile')}
                </Link>
            </div>
            <div className="flex items-center justify-center">
                <Logout />
            </div>
        </div >
    )
}

export default LeftMenu
