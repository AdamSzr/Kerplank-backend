
import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useEffect } from 'react'
import { menuTabs } from './menu-config'



const MenuComponent = () => {

    const router = useRouter()

    return (
        <Box >
            {menuTabs.map(it => <Button onClick={() => console.log(`przeniesienie do widoku [${it.title}]`)}> {it.title}</Button>)}
        </Box>
    )
}





export default MenuComponent