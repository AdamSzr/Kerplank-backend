
import { Box, Button, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useContext, useEffect } from 'react'
import { PageContext } from '../AppRootComponent/AppRootViewComponent'
import { Pages } from '../Menu/menu-config'

const AboutAppView = () => {

    const ctx = useContext(PageContext)

    const router = useRouter()

    return (
        <Container component="main"
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
                <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>
            <Typography>
                    Aplikacja Webowa do zarządzania projektami przy użyciu technik programowania zwinnego i spełnia następujące zadania:
            </Typography>
                </Box>
            <Box>
                <nav aria-label="elements list">
                    <List>
                        <ListItemText primary="- utworzenie nowego użytkownika z odpowiednią rolą," />
                        <ListItemText primary="- zarządzanie projektami oraz zadaniami przypisanymi do projektu," />
                        <ListItemText primary="- możliwość przesyłania na serwer i pobierania plików z określonego projektu," />
                        <ListItemText primary="- funkcjonalność systemu pozwalającą dodawać, modyfikować i usuwać dane projektów, zadań i studentów," />
                        <ListItemText primary="- ogólnodostępny chat," />
                        <ListItemText primary="- transmisja danych szyfrowana protokołem," />
                        <ListItemText primary="- resetowanie hasła." />
                    </List>
                </nav>
            </Box>
        </Container>
    );
}





export default AboutAppView