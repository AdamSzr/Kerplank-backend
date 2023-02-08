

import React, { useRef } from 'react'
import { uploadMultipleFile } from '../api/upload-file-fetch'
import { DirectoryItem } from '../models/DirectoryItem'

const UploadFileComponent: React.FC<{ currentPath: string, onUploadSuccess: (items:DirectoryItem[])=>void }> = ({ currentPath, onUploadSuccess }) => {

    const inputRef = useRef<HTMLFormElement>()

    const uploadClick: React.FormEventHandler<HTMLFormElement> = async (event) => {

        event.preventDefault()

        const dataForm = new FormData(inputRef.current)
        console.log("FormData size --", dataForm.getAll("files").length)

        dataForm.getAll("files").forEach((it) => {
            console.log((it as File).name)
        })

        const uploadResponse = await uploadMultipleFile(dataForm, currentPath)

        console.log(uploadResponse)

        onUploadSuccess(uploadResponse.items)
    }



    return (
        <div style={{ padding: 30, margin: 30, border: "2px solid black" }} >
            <h3> Uploading to {currentPath}</h3>
            <div >
                <form
                    ref={inputRef as React.LegacyRef<HTMLFormElement>}
                    onSubmit={uploadClick}
                    method='post' encType="multipart/form-data">
                    <div >
                        <input type="file" name="files" multiple />
                    </div>
                    <div >
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default UploadFileComponent