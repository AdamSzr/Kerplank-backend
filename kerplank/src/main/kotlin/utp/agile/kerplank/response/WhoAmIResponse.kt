package utp.agile.kerplank.response

import utp.agile.kerplank.model.BaseResponse

data class WhoAmIResponse(val nickname:String,val email:String, val details:Map<String,String>):BaseResponse()
