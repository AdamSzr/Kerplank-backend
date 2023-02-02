
import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useContext, useEffect } from 'react'
import { PageContext } from '../AppRootComponent/AppRootViewComponent'
import { Pages } from '../Menu/menu-config'
import img from './panda.jpg'
import Image from 'next/image'

const HomeMainView = () => {

    return <Box >
        <Image src={img} alt="panda"></Image>
    {/* For variant="text", adjust the height via font-size */}
    </Box>
}





export default HomeMainView