
import { Box, Button } from '@mui/material'
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

    return <Box >
        about page
    </Box>
}





export default AboutAppView