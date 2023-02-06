import React from 'react'
import uploadFile from '../src/features/api/upload-file-fetch'

const UploadingComponent = () => {

    return (
        <div>
            <div>UploadingComponent</div>


            <div style={{border:'3px solid black', margin:'15px', padding:'30px', }}>

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

            <div style={{border:'3px solid black', margin:'15px', padding:'30px'}}>

                <div >
                    <h1>Multiple File Upload Demo!</h1>
                    <form action="http://192.168.1.22:8080/api/drive/upload/multi" method='post' encType="multipart/form-data">
                        <div >
                            <label >Multiple</label>
                            <input type="file" name="files"  multiple />
                        </div>
                        <div >
                            <button type="submit" >Submit</button>
                        </div>
                    </form>
                </div >
            </div>



        </div >
    )
}

export default UploadingComponent