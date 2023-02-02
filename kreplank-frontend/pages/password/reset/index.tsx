

import {Box, Button, CssBaseline, Input, TextField, ThemeProvider, Container, Typography} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { generatePasswordReset } from '../../../src/features/api/generate-password-reset'
import { passwordReset, PasswordResetRequest } from '../../../src/features/api/password-reset-fetch'
import {createTheme} from "@mui/material/styles";

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
    return <Box>
      Pomyślnie idz sprawdz email.
      dalesze kroki beda w email.
    </Box>
  }
  const EmailChangeFailedComponent = () => {
    return <div>
    cos robisz nie tak.
    </div>
  }

  const theme = createTheme();

  const FormViewComponent = () => {
    return <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
              border: 3,
              borderRadius: 5,
              borderColor: 'primary.main',
              width: 620,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <img src="/icon_pass.png"
               alt="icon"
          />
          <Typography sx={{mt:2, textAlign: 'center'}}>Zresetuj swoje hasło. Na podany adres email wysłana zostanie wiadomość resetująca hasło. Wiadomość może być folderze SPAM.</Typography>
          <TextField sx={{mt: 2, mb: 2, minWidth: 500}} inputRef={inputRef}  placeholder='Adres email'>
          </TextField>
          <Button sx={{mb:1}} variant="contained" color="secondary" onClick={onSendClick}>
            Zatwierdź
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  }

  return (
    <div>
      zresetuj hasło


      {isSuccess == undefined && <FormViewComponent />}
      {isSuccess == false && <EmailChangeFailedComponent />}
      {isSuccess == true && <EmailChangeSuccessComponent />}



    </div>
  )
}

export default ResetComponent