import { ToastOptions } from "react-toastify"
import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color']
        }
    }

    interface ThemeOptions {
        status: {
            danger: React.CSSProperties['color']
        }
    }

    interface Palette {
        neutral: Palette['primary']
    }

    interface PaletteOptions {
        neutral: PaletteOptions['primary']
    }

    interface PaletteColor {
        darker?: string
    }

    interface SimplePaletteColorOptions {
        darker?: string
    }
}

export const toastOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    pauseOnHover: true,
    theme: 'dark'
}
export const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    "border-radius": '15px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
}

export const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#6132B4',
            darker: '#39206B',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#d7d7d7',
        },
    },
})
