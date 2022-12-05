
import { Box, Button } from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useContext, useEffect } from 'react'
import { PageContext } from '../HomeComponent/HomeViewComponent'

const AboutApp = () => {

    const ctx = useContext(PageContext)

    const router = useRouter()

    return <Box >
    {ctx.acctualPage}
    <Button onClick={() => ctx.setAcctualPage("ADAM")} >change</Button>
</Box>
}





export default AboutApp