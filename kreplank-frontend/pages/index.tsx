import { Button } from '@mui/material'
import { Container } from '@mui/material'
import { Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useEffect, useState } from 'react'
import { backendUrlStorage, jwtTokenStorage } from '../src/features/config'


export type KerplankEnv = {
  BACKEND_SERVER_URL: string,
}


export type SsrProps = {
  runtimeVariables: KerplankEnv
}

const IndexPage: NextPage<SsrProps> = (ssr) => {
  const router = useRouter()

  const [state, setState] = useState<"UNKNOWN" | "LOGGED" | "UNLOGGED">('UNKNOWN')

  useEffect(() => {
    backendUrlStorage.set(ssr.runtimeVariables.BACKEND_SERVER_URL)

    if (jwtTokenStorage.tryGet()) {
      setState('LOGGED')
      setTimeout(() => {
        router.push('/home')
      }, 2000);
    } else setState('UNLOGGED')

  }, [])


  if (state == 'UNKNOWN') {
      return(
          <Container component="main"
                     sx={{
                         marginTop: 8,
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center'
                     }}
          >
              <Typography>
                  <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>
                      Proszę czekać - trwa ładowanie strony
                  </Box>
              </Typography>
              <Stack spacing={1}>
                  <CircularProgress />
              </Stack>
          </Container>)
  }

  if (state == 'LOGGED') {
    return(
  <Container component="main"
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
  >
    <Typography>
        <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>
        Proszę czekać.
        Za chwilę ostaniesz przekierowany do strony domowej.
        </Box>
    </Typography>
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="circular" width={40} height={40} sx={{alignItems: 'left'}}/>
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
  </Container>)
  }


  return (
    <div >
      KERPLANK
      <Button onClick={() => router.push('/login')}>
        login
      </Button>
    </div>
  )
}



export async function getServerSideProps(context: { req: NextRequest, res: NextResponse }) {
  // ######################### DOWNLOADING LIST OF NUMBER #########################
  // const data = await fetch('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5')
  //   .then(r => r.json() as Promise<number[]>)

  // ######################### BACKEND_LOGIN_SERVER_URL  #########################
  const env = process.env
  const requiredVariables = ['BACKEND_SERVER_URL'] // ['APP_ID', 'APP_SECRET', 'JWT_SECRET', 'BACKEND_LOGIN_SERVER_URL']

  const variables = Object.entries(env).filter((v) => requiredVariables.some(i => i == v[0]))
  if (variables.some((k, v) => v == null) && variables.length == requiredVariables.length)
    throw new Error(`Missing ENVIRONMENT_VARIABLE, Declare all of [${requiredVariables.join(' ')}] values in .env `)

  return { props: { runtimeVariables: Object.fromEntries(variables) as KerplankEnv } as SsrProps }
}


export default IndexPage