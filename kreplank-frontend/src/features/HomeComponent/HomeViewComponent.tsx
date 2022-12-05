
import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useEffect } from 'react'
import { jwtTokenStorage } from '../config'

const HomeViewComponent = () => {

    return (
        <Box >
            {jwtTokenStorage.tryGet()??"EXCEPTION SHOULD BE THROWN"}
        </Box>
    )
}





export default HomeViewComponent