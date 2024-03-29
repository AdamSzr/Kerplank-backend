package utp.agile.kerplank.model

import org.bson.types.ObjectId
import utp.agile.kerplank.model.enumerate.TaskStatus
import java.time.Instant


data class Task(
    val id: String = ObjectId().toHexString(),
    var title: String,
    var description: String,
    var assignedTo: String? = null,
    var dateTimeCreation: Instant = Instant.now(),
    var dateTimeDelivery: Instant = Instant.now(),
    var status: TaskStatus = TaskStatus.NEW,
){
    fun update(updateRequest: TaskUpdateRequest){
        updateRequest.title?.let {
            this.title = it
        }
        updateRequest.description?.let {
            this.description = it
        }
        updateRequest.assignedTo?.let {
            this.assignedTo = it
        }
        updateRequest.dateTimeCreation?.let {
            this.dateTimeCreation = Instant.parse(it)
        }
        updateRequest.dateTimeDelivery?.let {
            this.dateTimeDelivery = Instant.parse(it)
        }
        updateRequest.status?.let {
            this.status = it
        }
    }
}


data class TaskCreateRequest(val projectId: String, val title: String, val description: String) {
    fun createTask(): Task {
        return Task(title = title, description = description)
    }
}

data class TaskUpdateRequest(
    val title:String?,
    val description: String?,
    val assignedTo: String?,
    val dateTimeCreation: String?,
    val dateTimeDelivery: String?,
    val status: TaskStatus?
)
