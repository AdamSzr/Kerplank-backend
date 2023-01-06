package utp.agile.kerplank.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import utp.agile.kerplank.model.enumerate.ProjectStatus
import utp.agile.kerplank.response.BaseResponse
import java.time.Instant


@Document
data class Project(
    @Id val id: String? = null,
    val title: String,
    var description: String,
    val dateTimeCreation: Instant = Instant.now(),
    val dateTimeDelivery: Instant,
    var status: ProjectStatus = ProjectStatus.ACTIVE,
    val creator: String,
    var users: MutableSet<String> = mutableSetOf(),
    var files: MutableSet<String> = mutableSetOf(), //paths = /notes/test.txt
    var tasks: MutableCollection<Task> = mutableListOf(), // tasks ids
) {
    fun appendTask(task: Task) = this.apply { tasks.add(task) }
    fun appendUser(userEmail: String) = this.apply { users.add(userEmail) }
    fun appendUsers(userEmailList: List<String>) = this.apply { users.addAll(userEmailList) }
    fun appendFile(filePath: String) = this.apply { files.add(filePath) }
    fun appendFiles(filePathList: List<String>) = this.apply { files.addAll(filePathList) }
    fun updateStatus(newStatus: ProjectStatus) = this.apply { status = newStatus }
    fun updateDescription(newDescription:String) = this.apply { description = newDescription }
}


data class ProjectCreateRequest(
    val title: String,
    val description: String,
    val dateTimeDelivery: Instant,
) {
    fun createProject(creatorEmail:String): Project {
        return Project(
            title = this.title,
            description = this.description,
            dateTimeDelivery = this.dateTimeDelivery,
            creator = creatorEmail,
        )
    }
}

data class ProjectResponse(val project: Project) : BaseResponse()

data class ProjectListResponse(val list: List<Project>) : BaseResponse()


data class ProjectUpdateRequest(
    val files: List<String>?,
    val users: List<String>?,
    val status: ProjectStatus?,
    val description: String?,
)

