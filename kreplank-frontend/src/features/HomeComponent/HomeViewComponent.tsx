
import { Box, Button, Divider } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { jwtTokenStorage } from '../config'
import MenuComponent from '../Menu/MenuComponent'
import HomeMainView from './HomeMainView'


export type PageContextType = {
    acctualPage: string, setAcctualPage: Dispatch<SetStateAction<string>>
}

export const PageContext = createContext<PageContextType>({ acctualPage: "", setAcctualPage: (x) => { console.log(x) } })

const HomeViewComponent = () => {

    const [acctualPage, setAcctualPage] = useState<string>('Home')

    

    const contextValue = { acctualPage, setAcctualPage } as PageContextType

    return (
        <PageContext.Provider value={contextValue}>
            <Box >
                <MenuComponent />
                <Divider/>
                <HomeMainView />
            </Box>
        </PageContext.Provider>

    )
}





export default HomeViewComponent