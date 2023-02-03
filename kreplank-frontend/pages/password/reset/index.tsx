

import {Box, Button, CssBaseline, Input, TextField, ThemeProvider, Container, Typography} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { generatePasswordReset } from '../../../src/features/api/generate-password-reset'
import { passwordReset, PasswordResetRequest } from '../../../src/features/api/password-reset-fetch'
import {createTheme} from "@mui/material/styles";
import {router} from "next/client";

const ResetComponent = () => {


  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>()
  

  const onSendClick = async () => {

    if ( !inputRef || inputRef.current?.value=='')
      return

    const email =  inputRef.current!.value

    const response =  await  generatePasswordReset(email)
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
                  Wysłano! Sprawdź skrzynkę pocztową. Dalesze kroki będa w emailu. Psst. wiadomość może być w razie czego w spamie.
              </Typography>
                <img src="/icon_email.png"
                     alt="icon_email"
                />
                <Button
                    sx={{
                        mt: 2,
                        mb: 2
                    }}
                    variant='contained' href="/login">
                    Strona logowania
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
                Błąd podczas wysyłania linku resetującego. Spróbuj ponownie, upewnij się czy email jest prawidłowo wpisany.
              </Typography>
              <img src="https://i.imgflip.com/79urlj.jpg"
                   alt="sadEmail"
              />
              <Button
                  sx={{
                    marginTop: 2
                  }}
                  variant='contained' onClick={()=> {setIsSuccess(undefined)}}>
                Powrót do resetowania hasła
              </Button>

              <Button
                  sx={{
                    mt: 2,
                    mb: 2
                  }}
                  variant='contained' href='/'>
                Strona główna
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
          <Typography sx={{textAlign: 'center', padding: 2}}>Zresetuj swoje hasło. Na podany adres email wysłana zostanie wiadomość resetująca hasło. Wiadomość może być folderze SPAM.</Typography>
          <TextField sx={{mb: 2, minWidth: 400}} inputRef={inputRef}  placeholder='Adres email' required>
          </TextField>
          <Button sx={{mb:1}} variant="contained" color="secondary" onClick={onSendClick}>
            Zatwierdź
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