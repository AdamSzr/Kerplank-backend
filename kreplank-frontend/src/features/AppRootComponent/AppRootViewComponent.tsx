
import { Box, Button, Divider } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { jwtTokenStorage } from '../config'
import { HomePage, MenuTab, Pages } from '../Menu/menu-config'
import MenuComponent from '../Menu/MenuComponent'
import HomeMainView from '../HomeComponent/HomeMainView'


export type PageContextType = {
    acctualPage: MenuTab, setAcctualPage: Dispatch<SetStateAction<MenuTab>>
}

export const PageContext = createContext<PageContextType>({ acctualPage: HomePage , setAcctualPage: (x) => { console.log(x) } })

const AppRootViewComponent = () => {

    const [acctualPage, setAcctualPage] = useState<MenuTab>(HomePage)



    const contextValue = { acctualPage, setAcctualPage } as PageContextType

    return (
        <PageContext.Provider value={contextValue}>
            <Box >
                <MenuComponent />
                <Divider />
                {acctualPage.view}
            </Box>
        </PageContext.Provider>

    )
}





export default AppRootViewComponent