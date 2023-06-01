package utp.agile.kerplank.model.event

import utp.agile.kerplank.model.DirectoryItem

data class ProjectFileUpdateEvent(val projectId:String,val files:List<DirectoryItem>)
