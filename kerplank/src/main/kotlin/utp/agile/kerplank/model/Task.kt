package utp.agile.kerplank.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import utp.agile.kerplank.model.enumerate.ProjectStatus
import utp.agile.kerplank.model.enumerate.TaskStatus
import java.time.Instant
import javax.validation.constraints.Size


data class Task(
    @Size(max = 100) val title: String,
    @Size(max = 2000) val description: String,
    val assignedTo: User? = null,
    val dateTimeCreation: Instant = Instant.now(),
    val dateTimeDelivery: Instant = Instant.now(),
    val status: TaskStatus = TaskStatus.NEW,
)


data class TaskCreateRequest(val projectId: String, val title: String, val description: String) {
    fun createTask(): Task {
        return Task(title = title, description = description)
    }
}
