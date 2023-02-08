import React, { useRef, useState } from 'react'
import uploadFile, { uploadMultipleFile } from '../src/features/api/upload-file-fetch'
import { backendUrlStorage, Endpoints } from '../src/features/config'
import { SingleFile } from '../src/features/models/DirectoryItem'
// import FormData from 'form-data'


const UploadingComponent = () => {

    const inputRef = useRef<HTMLFormElement>()
    const [uploadedFiles, setUploadedFiles] = useState<null | SingleFile[]>()


    const uploadClick: React.FormEventHandler<HTMLFormElement> = async (event) => {

        // const xhr = new XMLHttpRequest()
        // xhr.open('POST',Endpoints['drive.upload.multiple'])
        // xhr.send(event.target)

        event.preventDefault()

        // TODO HANDLER -->
        const dataForm = new FormData(inputRef.current)
        console.log("FormData size --", dataForm.getAll("files").length)

        dataForm.getAll("files").forEach((it) => {
            console.log((it as File).name)
        })


        // FETCH - no headers. 
        // body:dataForm


        // dataForm.append('files', event.bubbles)
        // console.log(event, inputRef, dataForm)
        // heder contn-type mulitpart/dataform 
        const uploadResponse = await uploadMultipleFile(dataForm)
        setUploadedFiles(uploadResponse.files)

    }



    const DisplayUploadedFilesComponent = () => {
        const backend = backendUrlStorage.tryGet()
        if (!backend)
            return <h1> No BackendUrl provided</h1>

        return <div>
            {uploadedFiles?.map(it => <div><a href={`${backend}/api/drive/file?path=/${it.name}`} download > {it.name} </a></div>)}
        </div>
    }

    return (
        <div>
            <div>UploadingComponent</div>

            <div style={{ border: '3px solid black', margin: '15px', padding: '30px', }}>

                <div >
                    <h1>Single File Upload Demo!</h1>
                    <form action="http://192.168.1.22:8080/api/drive/upload" method='post' encType="multipart/form-data">
                        <div >
                            <label >User</label>
                            <input type="text" name="user-name" />

                            <label >Single</label>
                            <input type="file" name="fileToUpload" id="fileToUpload1" />
                        </div>
                        <div >
                            <button type="submit" >Submit</button>
                        </div>
                    </form>
                </div >
            </div>

            <div style={{ border: '3px solid black', margin: '15px', padding: '30px' }}>
                <div >
                    <h1>Multiple File Upload Demo!</h1>
                    <form action="http://192.168.1.22:8080/api/drive/upload/multi" method='post' encType="multipart/form-data">
                        <div >
                            <label >Multiple</label>
                            <input type="file" name="files" multiple />
                        </div>
                        <div >
                            <button >Submit</button>
                        </div>
                    </form>
                </div >
            </div>

            <div style={{ border: '3px solid black', margin: '15px', padding: '30px' }}>

                <div >
                    <h1>Multiple File Upload WITH BTN ONCLICK Demo!</h1>
                    <form
                        ref={inputRef as React.LegacyRef<HTMLFormElement>}
                        // action=""
                        onSubmit={uploadClick}
                        method='post' encType="multipart/form-data">
                        <div >
                            <label >Multiple</label>
                            <input type="file" name="files" multiple />
                        </div>
                        <div >
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div >
            </div>


            <div>
                {uploadedFiles ? <DisplayUploadedFilesComponent /> : ""}
            </div>

        </div >
    )
}

export default UploadingComponent