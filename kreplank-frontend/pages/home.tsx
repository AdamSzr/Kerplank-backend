import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useEffect } from 'react'
import { backendUrlStorage } from '../src/features/config'
import HomeViewComponent from '../src/features/HomeComponent/HomeViewComponent'



const HomePage: NextPage = () => {

    return (
        <HomeViewComponent />
    )
}





export default HomePage