package utp.agile.kerplank.model

import utp.agile.kerplank.response.BaseResponse

data class FileDrive(val name:String,val path:String)

data class UploadFileResponse( val files: List<FileDrive>):BaseResponse()
