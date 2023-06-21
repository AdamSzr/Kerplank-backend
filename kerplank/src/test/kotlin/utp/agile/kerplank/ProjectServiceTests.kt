package utp.agile.kerplank

import com.mongodb.assertions.Assertions.*
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationEventPublisher
import reactor.test.StepVerifier
import utp.agile.kerplank.model.*
import utp.agile.kerplank.model.enumerate.TaskStatus
import utp.agile.kerplank.model.event.FileDeleteEvent
import utp.agile.kerplank.repository.ProjectRepository
import utp.agile.kerplank.service.ProjectService
import java.time.Instant
import java.time.temporal.ChronoUnit


@SpringBootTest
class ProjectServiceTests {

    @Autowired
    lateinit var projectService: ProjectService

    @Autowired
    lateinit var publisher: ApplicationEventPublisher

    @Autowired
    lateinit var projectRepository: ProjectRepository

    @Test
    fun should_Create_Project_With_Given_Name() {
        val request = ProjectCreateRequest("test-reactor-verifier", "adam-test-backned", Instant.now())
        val creatorEmail = "stepverifier"
        StepVerifier.create(projectService.createProject(creatorEmail = creatorEmail, request))
                .expectNextMatches { it.creator==creatorEmail}
                .expectComplete()
                .verify()
    }


    @Test
    fun should_Delete_File_WithIn_Given_Proj() {
        val projectId = "644feb7a7a4ad85d5de3ea83"

        val project = projectService.findProjectById(projectId,"user").block() ?: return

        publisher.publishEvent(FileDeleteEvent(project.files.toList()[0]))
        Thread.sleep(2000)
        val afterUpdate = projectService.findProjectById(projectId,"user").block()?:return

        Assertions.assertTrue( project.files.size > afterUpdate.files.size )

//        val project = projectService.findProjectById(projectId,"user").block()

//        StepVerifier.create( project )
//            .consumeNextWith {
//                val fileToDel = it.files.toTypedArray().get(0)
//                println("delete file with name $fileToDel")
//                publisher.publishEvent(FileDeleteEvent(fileToDel))
//            }
//                .consumeNextWith { it -> projectService.findProjectById(projectId,"user")  }
//                .expectNextMatches( Predicate { it -> it.files.count()< project. })
//
//


//        val creatorEmail = "stepverifier"
//        StepVerifier.create<Project>(projectService.createProject(creatorEmail = creatorEmail, request))
//            .expectNextMatches { it.creator==creatorEmail }
//            .expectComplete()
//            .verify()
    }

    @Test
    fun should_Return_My_Projects() {
        val userEmail = "get_my_project_test_user"

        val project1 = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "project description",
            title = "Test project 1",
            users = mutableSetOf(userEmail)
        )
        val project2 = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "project description",
            title = "Test project 2",
            users = mutableSetOf(userEmail)
        )

        val proj1 = projectRepository.save(project1).block()
        val proj2 = projectRepository.save(project2).block()

        StepVerifier.create(projectService.findMyProjects(userEmail))
            .expectNext(proj1, proj2)
            .expectComplete()
            .verify()

        projectService.deleteProject(userEmail, proj1?.id.toString()).block()
        projectService.deleteProject(userEmail, proj2?.id.toString()).block()
    }

    @Test
    fun should_Return_All_Projects() {
        val project1 = Project(
            creator = "user1@example.com",
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project 1 description",
            title = "Project 1"
        )
        val project2 = Project(
            creator = "user2@example.com",
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project 2 description",
            title = "Project 2"
        )

        val actualProjectNumber = projectService.findAllProjects().count().block()
        val proj1 = projectRepository.save(project1).block()
        val proj2 = projectRepository.save(project2).block()

        StepVerifier.create(projectService.findAllProjects())
            .expectNextCount(actualProjectNumber?.plus(2) ?: 0)
            .expectComplete()
            .verify()

        projectService.deleteProject("user1@example.com", proj1?.id.toString()).block()
        projectService.deleteProject("user2@example.com", proj2?.id.toString()).block()
    }

    @Test
    fun should_Return_Project_By_Id_And_User_Email() {
        val userEmail = "user1@example.com"
        val project = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            users = mutableSetOf(userEmail)
        )
        val savedProject = projectRepository.save(project).block()

        val projectId = savedProject?.id!!

        StepVerifier.create(projectService.findProjectById(projectId, userEmail))
            .expectNext(savedProject)
            .expectComplete()
            .verify()

        projectService.deleteProject("user1@example.com", projectId).block()
    }

    @Test
    fun should_Create_Task_In_Project() {
        val userEmail = "user1@example.com"
        val project = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            users = mutableSetOf(userEmail)
        )
        val savedProject = projectRepository.save(project).block()
        val taskRequest = TaskCreateRequest(
            projectId = savedProject?.id ?: "",
            title = "Test task",
            description = "Task description"
        )

        StepVerifier.create(projectService.createTask(userEmail, taskRequest))
            .expectNextMatches { retrievedProject ->
                retrievedProject.title == project.title &&
                        retrievedProject.description == project.description &&
                        retrievedProject.dateTimeCreation == project.dateTimeCreation &&
                        retrievedProject.dateTimeDelivery == project.dateTimeDelivery &&
                        retrievedProject.creator == project.creator &&
                        retrievedProject.users == project.users

            }
            .expectComplete()
            .verify()

        val updatedProject = projectRepository.findById(savedProject?.id ?: "").block()
        val createdTask = updatedProject?.tasks?.find { it.title == "Test task"}
        assertNotNull(createdTask)

        projectService.deleteProject(userEmail, savedProject?.id ?: "").block()
    }

    @Test
    fun should_Update_Task_In_Project() {
        val userEmail = "user1@example.com"

        val project = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            users = mutableSetOf(userEmail)
        )

        val task = Task(
            id = "task1",
            title = "Test task",
            description = "Task description"
        )
        project.tasks.add(task)

        val savedProject = projectRepository.save(project).block()

        val taskId = "task1"
        val updateRequest = TaskUpdateRequest(
            assignedTo = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS).toString(),
            dateTimeDelivery = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS).toString(),
            description = "task",
            title = "Test task",
            status = TaskStatus.NEW
        )

        StepVerifier.create(projectService.updateTask(userEmail, taskId, updateRequest))
            .expectNextMatches { retrievedProject ->
                retrievedProject.title == project.title &&
                        retrievedProject.description == project.description &&
                        retrievedProject.dateTimeCreation == project.dateTimeCreation &&
                        retrievedProject.dateTimeDelivery == project.dateTimeDelivery &&
                        retrievedProject.creator == project.creator &&
                        retrievedProject.users == project.users
            }
            .expectComplete()
            .verify()

        val updatedProject = projectRepository.findById(savedProject?.id ?: "").block()
        val updatedTask = updatedProject?.tasks?.find { it.id == taskId }
        assertNotNull(updatedTask)
        assertEquals("Test task", updatedTask?.title)

        projectService.deleteProject(userEmail, savedProject?.id ?: "").block()
    }

    @Test
    fun should_Delete_Project() {
        val creatorEmail = "user1@example.com"
        val project = Project(
            creator = creatorEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            users = mutableSetOf(creatorEmail)
        )

        val savedProject = projectRepository.save(project).block()
        val projectId = savedProject?.id ?: ""

        StepVerifier.create(projectService.deleteProject(creatorEmail, projectId))
            .expectNext(savedProject)
            .expectComplete()
            .verify()

        val deletedProject = projectRepository.findById(projectId).block()
        assertNull(deletedProject)
    }

    @Test
    fun should_Delete_User_From_Project() {
        val userEmail = "user1@example.com"
        val project = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            users = mutableSetOf(userEmail)
        )

        val savedProject = projectRepository.save(project).block()
        val projectId = savedProject?.id ?: ""

        StepVerifier.create(projectService.deleteUserFromProject(userEmail, projectId, userEmail))
            .expectNextMatches { retrievedProject ->
                retrievedProject.title == project.title &&
                        retrievedProject.description == project.description &&
                        retrievedProject.dateTimeCreation == project.dateTimeCreation &&
                        retrievedProject.dateTimeDelivery == project.dateTimeDelivery &&
                        retrievedProject.creator == project.creator
            }
            .expectComplete()
            .verify()

        val updatedProject = projectRepository.findById(projectId).block()
        assertNotNull(updatedProject)
        assertFalse(updatedProject?.users?.contains(userEmail) ?: true)

        projectService.deleteProject(userEmail, savedProject?.id ?: "").block()
    }

    @Test
    fun should_Delete_Path_From_Project() {
        val userEmail = "user1@example.com"
        val filePath = "/path/to/file.txt"
        val project = Project(
            creator = userEmail,
            dateTimeCreation = Instant.now().truncatedTo(ChronoUnit.MILLIS),
            dateTimeDelivery = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MILLIS),
            description = "Project description",
            title = "Test project",
            files = mutableSetOf(filePath)
        )

        val savedProject = projectRepository.save(project).block()
        val projectId = savedProject?.id ?: ""

        StepVerifier.create(projectService.deletePathFromProject(userEmail, projectId, filePath))
            .expectNextMatches { retrievedProject ->
                retrievedProject.title == project.title &&
                        retrievedProject.description == project.description &&
                        retrievedProject.dateTimeCreation == project.dateTimeCreation &&
                        retrievedProject.dateTimeDelivery == project.dateTimeDelivery &&
                        retrievedProject.creator == project.creator
            }
            .expectComplete()
            .verify()

        val updatedProject = projectRepository.findById(projectId).block()
        assertNotNull(updatedProject)
        assertFalse(updatedProject?.files?.contains(filePath) ?: true)

        projectService.deleteProject(userEmail, savedProject?.id ?: "").block()
    }
}
