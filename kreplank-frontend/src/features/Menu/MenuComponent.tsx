
import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useContext, useEffect } from 'react'
import { PageContext } from '../AppRootComponent/AppRootViewComponent'
import { jwtTokenStorage } from '../config'
import { MenuTab, Pages } from './menu-config'



const MenuComponent = () => {

    const ctx = useContext(PageContext)

    const router = useRouter()
    console.log()

    const createMenuBtn = (menuTab: MenuTab) => {
        return <Button key={`menu-tab-${menuTab.title}`} onClick={() => {
            console.log(`przeniesienie do widoku [${menuTab.title}]`);
            ctx.setAcctualPage(menuTab);

        }}> {menuTab.title}</Button>
    }
    const createLogout = () => {
        return <Button variant="contained" key={`menu-tab-lotout`} onClick={() => {
            console.log(`logout bye`);
            jwtTokenStorage.clear()
            router.push('/login')

        }}> Wyloguj</Button>
    }


    return (
        <Box>
            {Object.values(Pages).map((it: MenuTab) => createMenuBtn(it))
                .concat([createLogout()])}
        </Box>

    );
}





export default MenuComponent