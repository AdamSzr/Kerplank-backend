

import { Box, Button, Input, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { generatePasswordReset } from '../../../src/features/api/generate-password-reset'
import { passwordReset, PasswordResetRequest } from '../../../src/features/api/password-reset-fetch'

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


  const FormViewComponent = () => {
    return <div>
      < TextField inputRef={inputRef}  placeholder='Wpisz adres email'>
      </TextField>
      <Button onClick={onSendClick}>
        Wyświj formularz na email
        </Button>
    </div>
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