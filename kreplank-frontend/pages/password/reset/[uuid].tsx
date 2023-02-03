import {Box, Button, CssBaseline, Input, TextField, ThemeProvider, Container, Typography} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { passwordReset, PasswordResetRequest } from '../../../src/features/api/password-reset-fetch'
import {createTheme} from "@mui/material/styles";

const ResetComponent = () => {

  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>()
  const uuid = router.query.uuid as string


  const onResetClick = async () => {

    if ( uuid == '' || !inputRef || inputRef.current?.value=='')
      return


    const request: PasswordResetRequest = {
      uuid,
      password:(inputRef.current!).value
    }
    const response = await passwordReset(request)
    console.log({response})
    if (response.status == 200) {
      setIsSuccess(true)
    }
    else {
      setIsSuccess(false)
    }
  }


  const EmailChangeSuccessComponent = () => {
    return (
        <ThemeProvider theme={theme}>
          <Container component="main" sx={{width: 800}}>
            <CssBaseline />
            <Box
                sx={{
                  border: 3,
                  borderRadius: 5,
                  borderColor: 'primary.main',
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
              <Typography sx={{mt: 2, mb: 2, fontWeight: 'bold', fontSize: 16, textAlign: 'center', maxWidth: 500}}>
                Hasło zresetowano pomyślne.
              </Typography>
                <img src="/icon_success.png"
                     alt="icon_success"
                />
              <Button
                  sx={{
                    mt: 2,
                    mb: 2
                  }}
                  variant='contained' href='/login'>
                Strona główna
              </Button>
            </Box>
          </Container>
        </ThemeProvider>
    )
  }

  const EmailChangeFailedComponent = () => {
    return (
        <ThemeProvider theme={theme}>
          <Container component="main" sx={{width: 800}}>
            <CssBaseline />
            <Box
                sx={{
                  border: 3,
                  borderRadius: 5,
                  borderColor: 'primary.main',
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
              <Typography sx={{mt: 2, mb: 2, fontWeight: 'bold', fontSize: 16, textAlign: 'center', maxWidth: 500}}>
                Błąd podczas resetowania hasła. Spróbuj ponownie.
              </Typography>
                <img src="/icon_fail.jpg"
                     alt="icon_fail"
                />
              <Button
                  sx={{
                      mt: 2,
                      mb: 2
                  }}
                  variant='contained' onClick={()=> {setIsSuccess(undefined)}}>
                Powrót do resetowania hasła
              </Button>
            </Box>

          </Container>
        </ThemeProvider>
    )
  }

  const theme = createTheme();

  const FormViewComponent = () => {
    return <ThemeProvider theme={theme}>
      <Container component="main" sx={{width: 600}}>
        <CssBaseline />
        <Box
            sx={{
              border: 3,
              borderRadius: 5,
              borderColor: 'primary.main',
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

            }}
        >
          <img src="/icon_pass.png"
               alt="icon_pass"
          />
          <Typography sx={{textAlign: 'center', padding: 2}}>Zresetuj swoje hasło. Wpisz nowe hasło</Typography>
            <TextField sx={{mt: 2, mb: 2, minWidth: 500}} inputRef={inputRef}  placeholder='Wpisz nowe hasło' required>
            </TextField>
            <Button sx={{mb:1}} variant="contained" color="secondary" onClick={onResetClick}>
                Zatwierdź
            </Button>
            <Button sx={{mb:1}} variant="contained" color="secondary" href="/">
                Powrót
            </Button>
        </Box>
      </Container>
    </ThemeProvider>
  }

  return (
      <Box>
        {isSuccess == undefined && <FormViewComponent />}
        {isSuccess == false && <EmailChangeFailedComponent />}
        {isSuccess == true && <EmailChangeSuccessComponent />}
      </Box>
  )
}

export default ResetComponent