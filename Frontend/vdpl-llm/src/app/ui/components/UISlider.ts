import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

const UISlider = styled(Slider)(({ theme }) => ({
    color: '#007bff',
    height: 5,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
        height: 10,
        width: 20,
        backgroundColor: '#fff',
        boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
        '&:focus, &:hover, &.Mui-active': {
            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
            '@media (hover: none)': {
                boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
            },
        },
        '&:before': {
            boxShadow:
                '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 15,
        fontWeight: 'normal',
        top: 10,
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&::before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: '#000',
            ...theme.applyStyles('dark', {
                color: '#fff',
            }),
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: '4px !important',
    },
    '& .MuiSlider-rail': {
        opacity: 0.5,
        boxShadow: 'inset 0px 0px 4px -2px #000',
        backgroundColor: '#d0d0d0',
    },

    ...theme.applyStyles('dark', {
        color: '#0a84ff',
    }),
}));

export default UISlider;
