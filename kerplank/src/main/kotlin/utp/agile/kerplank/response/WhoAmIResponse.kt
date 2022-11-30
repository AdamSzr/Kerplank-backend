package utp.agile.kerplank.response

data class WhoAmIResponse(val nickname:String,val email:String, val details:Map<String,String>): BaseResponse()
