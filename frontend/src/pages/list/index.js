import * as React from 'react';
import "./index.scss";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Song2Img from "../../assest/Blur_-_Song_2.jpg";
import RamonesImg from "../../assest/hqdefault.jpg";

const searchString = 'Caneta Azul';
const songs = [
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
    {
        nome: 'Song2',
        banda: 'Blur',
        img: Song2Img,
        link: '',
    },
    {
        nome: 'Blitzkrieg Bop',
        banda: 'Ramones',
        img: RamonesImg,
        link: '',
    },
]
export default function SongsList() {
    return (
        <>
            <div className='description'>
                <h2>Playlist baseada em <u>{searchString}</u></h2>
            </div>
            <div className='div-content'>
                <div className='songs-list'>
                    <Box sx={{ width: '100%', color: 'white', alignSelf: 'center' }}>
                        <List>
                            {songs.map((song) =>
                                <a href="">
                                    <ListItem disablePadding>
                                        <ListItemButton component="a" href={song.link}>
                                            <img src={song.img} height="50" width='50' className='img-song' />
                                            <ListItemText primary={song.nome} secondary={song.banda} />
                                        </ListItemButton>
                                    </ListItem>
                                </a>
                            )}
                        </List>
                    </Box>
                </div>
            </div>
        </>
    );
}