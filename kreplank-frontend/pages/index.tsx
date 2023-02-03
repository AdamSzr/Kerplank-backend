import { Button } from '@mui/material'
import { Container } from '@mui/material'
import { Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { NextRequest, NextResponse } from 'next/server'
import { useEffect, useState } from 'react'
import { backendUrlStorage, jwtTokenStorage } from '../src/features/config'
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../src/features/models/JwtPayload';

export type KerplankEnv = {
  BACKEND_SERVER_URL: string,
}


export type SsrProps = {
  runtimeVariables: KerplankEnv
}

const IndexPage: NextPage<SsrProps> = (ssr) => {
  const router = useRouter()

  const [state, setState] = useState<"LOGGED" | "UNLOGGED">("UNLOGGED")

  useEffect(() => {
    if (!backendUrlStorage.tryGet())
      backendUrlStorage.set(ssr.runtimeVariables.BACKEND_SERVER_URL)

    const jwtToken = jwtTokenStorage.tryGet()?.split(' ')[1]

    if (!jwtToken)
      return

    const jwtPayload = jwtDecode<JwtPayload>(jwtToken)
    const jwtExiresAt = new Date(jwtPayload.exp * 1000)

    if (jwtExiresAt > new Date()) {
      console.log("You are logged already - redirecting")
      setState('LOGGED')
    } else {
      console.log("Your JWT token has been expired")
      jwtTokenStorage.clear()
    }

  }, [])


  const RedirectView = () => {
    setTimeout(() => {
      router.push('/home')
    }, 1000);

    return (
      <Container component="main"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >

        <Box sx={{ fontWeight: 'bold', fontSize: 16 }}>
          <Typography sx={{
            marginBottom: 2
          }}>
            Proszę czekać.
            Za chwilę ostaniesz przekierowany do strony domowej.
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="circular" width={40} height={40} sx={{ alignItems: 'left' }} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      </Container>)
  }

  const GoToLoadPageView = () => {
    return (
      <Container component="main"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
          <Box>
            <img src="https://esahayakio.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/10/23114934/360_F_304766094_oGfiNaNzXOXli1xFLLeqYgZjBABsUB29.jpg"
                 alt="welcomeImage"
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: 16, marginTop: 2}}>
              Przejdz do strony logowania
            </Typography>
          </Box>
          <Button sx={{ marginTop: 2, marginBottom: 2 }} variant="contained" color="primary" href="/login">Zaloguj się</Button>
          <Typography >
            lub
          </Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: 16, marginTop: 2 }}>
            Zarejestruj się
          </Typography>

          <Button sx={{ margin: 1 }} variant="contained" color="secondary" href="/login">Zarejestruj się</Button>
      </Container>
    )
  }



  return (
    <>
      {state == 'UNLOGGED' && <GoToLoadPageView />}
      {state == 'LOGGED' && <RedirectView />}
    </>

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