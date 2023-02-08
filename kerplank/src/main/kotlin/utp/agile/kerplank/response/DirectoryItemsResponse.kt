package utp.agile.kerplank.response

import utp.agile.kerplank.model.DirectoryItem

data class DirectoryItemsResponse(val items: List<DirectoryItem>) : BaseResponse()

