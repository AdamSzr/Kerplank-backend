

import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Stack } from '@mui/system'
import { Box, Button, Container, Input, Typography } from '@mui/material'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { Project } from '../models/Project'
import { Endpoints } from '../config'
import { uploadMultipleFile } from '../api/upload-file-fetch'
import updateProject from '../api/update-project-fetch'
import { ax } from '../api/ax'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectFileUploadComponent:React.FC<{ project?: Project}> = ({ project }) => {
  const [ selectedFile, setSelectedFile ] = useState<File | null>(null)
  const [ dataForm, setDataForm ] = useState<FormData | null>(null)
  const ctx = useContext( ProjectViewContext )

  const inputRef = useRef<HTMLFormElement>()

  useEffect( () => {
    if (!dataForm) return 
    dataForm!.getAll( `files` ).forEach( it => {
      console.log( (it as File).name )
    } )

  }, [ dataForm != null ] )


  function onUploadSuccess() {
    clearFormData()
  }

  const  uploadClick:React.FormEventHandler<HTMLFormElement> =  async function( event )  {
    event.preventDefault()

    if (!dataForm) return
    
    console.log( `FormData items size --`, dataForm.getAll( `files` ).length )

    const { result, proj } = await uploadMultipleFile( dataForm, `/${project?.id}` ).then( it => ({ ...it, proj:it.project }) )

    const idx = ctx.projectList?.findIndex( it => it.id == proj.id )!
    if (result != `ok` || idx < 0) {
      console.error( `Błąd przesyłania pliku` )
      return
    }

    // console.log( project )

    const newProjList = [ ctx.projectList!.slice( 0, idx ), proj, ctx.projectList!.slice( idx + 1 ) ]
    ctx.setProjectList( newProjList as Project[] )

    onUploadSuccess()
  }


  const handleFileChange = (e:unknown) => {
    console.log( `file added`, e )
    const dataForm = new FormData( inputRef.current )
    setDataForm( dataForm )
  }


  const ShowFiles = () => {
    dataForm!.getAll( `files` ).forEach( it => {
      console.log( (it as File).name )
    } )
    return <>{dataForm!.getAll( `files` ).filter( it => it instanceof File ).map( file => <Box>{(file as File).name}</Box> )}</>
  }

  const clearFormData = () => {
    inputRef.current?.reset()
    setDataForm( null ) 
  }


  console.log({ disabled:Boolean( !dataForm ) })

  return (
    <Container sx={
      {
        marginTop: 2,
        marginBottom: 2,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `left`,
        minWidth: 700,
        border: 3,
        borderRadius: 5,
        borderColor: `primary.main`,
        padding: 2,
      }
    }
    >
      <Typography textAlign="center" sx={{ marginBottom:`30px` }}> {dataForm == null ? `Wybierz plik aby przesłać` : `Twoje pliki:`}</Typography>

       
      {
        dataForm != null &&
        <Stack textAlign="center">
          <ShowFiles />
        </Stack>
      }

       
      <Box display="flex" justifyContent="center">
        <form
          ref={inputRef as React.LegacyRef<HTMLFormElement>}
          onSubmit={uploadClick}
          method='post' encType="multipart/form-data"
        >
          <Box sx={{ display:dataForm != null ? `none` : `unset` }}>
            <input type="file" name="files" multiple onChange={e => { handleFileChange( e ) }}   />
          </Box>

         

          <Box sx={{ marginTop:`40px`, display:`flex`, gap:`5px` }}>
            <Button
              fullWidth variant="contained" onClick={() => clearFormData}
            >Wyczyść</Button>
            <Button fullWidth disabled={Boolean( !dataForm )} color="secondary" variant="contained" type='submit'>Zapisz</Button>
          </Box>
        </form>
      </Box>
    </Container>
  )
}

export default ProjectFileUploadComponent

