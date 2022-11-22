package utp.agile.kerplank.response

import utp.agile.kerplank.model.BaseResponse

open class FailResponse(message: String, code: Number) : BaseResponse("fail")
