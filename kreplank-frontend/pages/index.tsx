import { Button } from '@mui/material'
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
    }
  }, [])


  if (state == 'UNKNOWN') {
    return <Box>
      Proszę czekać - trwa ładowanie strony
    </Box>
  }

  if (state == 'LOGGED') {
    return <Box>
      Proszę czekać. Za chwilę
      Zostaniesz przekierowany do strony domowej.
    </Box>
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