

import { Box, Button, Input, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { passwordReset, PasswordResetRequest } from '../../../src/features/api/password-reset-fetch'

const ResetComponent = () => {

  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>()
  const uuid = router.query.uuid as string


  const onResetClick = async () => {

    if ( uuid == '' || !inputRef)
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


  const FormViewComponent = () => {
    return <div>
      < TextField inputRef={inputRef}  placeholder='Wpisz nowe hasło'>
      </TextField>
      <Button onClick={onResetClick}>
        zatwierdz
      </Button>
    </div>
  }

  return (
    <div>
      reset-component

      {isSuccess == undefined && <FormViewComponent />}
      {isSuccess == false && <EmailChangeFailedComponent />}
      {isSuccess == true && <EmailChangeSuccessComponent />}



    </div>
  )
}

export default ResetComponent