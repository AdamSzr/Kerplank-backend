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
    val description: String,
    val dateTimeCreation: Instant = Instant.now(),
    val dateTimeDelivery: Instant,
    val status: ProjectStatus = ProjectStatus.ACTIVE,
    val creator: String,
    var users: MutableCollection<User> = mutableListOf(),
    var files: MutableCollection<String> = mutableListOf(), //paths = /notes/test.txt
    var tasks: MutableCollection<Task> = mutableListOf(), // tasks ids
) {
    fun appendTask(task: Task) = this.apply { tasks.add(task) }
    fun appendUser(user: User) = this.apply { users.add(user) }
    fun appendUsers(userList: List<User>) = this.apply { users.addAll(userList) }
    fun appendFile(filePath: String) = this.apply { files.add(filePath) }
    fun appendFiles(filePathList: List<String>) = this.apply { files.addAll(filePathList) }
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
)

