import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { theme } from '../utils/utils'
import { ThemeProvider } from '@mui/material';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" color="primary" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function LinearWithValueLabel({ value }: { value: number }) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={value} />
        </Box>
    );
}
