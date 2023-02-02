import {Box, Button, CssBaseline, Input, TextField, ThemeProvider, Container} from '@mui/material'
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
    return <Box>
      Pomyślnie.
    </Box>
  }
  const EmailChangeFailedComponent = () => {
    return <div>
      Nie udało się.
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
              Width: 420,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <TextField sx={{mt: 2, mb: 2}} inputRef={inputRef}  placeholder='Wpisz nowe hasło'>
          </TextField>
          <Button sx={{mb:1}} variant="contained" color="secondary" onClick={onResetClick}>
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