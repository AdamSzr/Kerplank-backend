package utp.agile.kerplank.response

import utp.agile.kerplank.model.BaseResponse

open class SuccessResponse : BaseResponse("ok")
open class FailResponse(message: String, code: Number) : BaseResponse("fail")
