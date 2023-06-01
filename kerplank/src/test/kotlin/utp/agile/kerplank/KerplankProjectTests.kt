package utp.agile.kerplank

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import reactor.test.StepVerifier
import utp.agile.kerplank.model.Project
import utp.agile.kerplank.model.ProjectCreateRequest
import utp.agile.kerplank.model.event.FileDeleteEvent
import utp.agile.kerplank.service.ProjectService
import utp.agile.kerplank.service.UserService
import java.time.Instant


@SpringBootTest
class KerplankProjectTests {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var projectService: ProjectService

    @Autowired
    lateinit var passwordencoder: BCryptPasswordEncoder

    @Autowired
    lateinit var publisher: ApplicationEventPublisher

    @Test
    fun Should_Create_Project_With_Given_Name() {
        val request = ProjectCreateRequest("test-reactor-verifier", "adam-test-backned", Instant.now())
        val creatorEmail = "stepverifier"
        StepVerifier.create<Project>(projectService.createProject(creatorEmail = creatorEmail, request))
            .expectNextMatches { it.creator==creatorEmail }
            .expectComplete()
            .verify()
    }


    @Test
    fun Should_Delete_File_WithIn_Given_Proj() {
        val projectId = "644feb7a7a4ad85d5de3ea83"

        val proj = publisher.publishEvent(FileDeleteEvent(projectId))

        val project = projectService.findProjectById(projectId,"user")


        StepVerifier.create( project )
            .consumeNextWith {
                publisher.publishEvent(FileDeleteEvent(it.files.toTypedArray().get(0)))
            }
            .consumeNextWith { projectService.findProjectById(projectId,"user") }
            .assertNext { it.files }


//        val creatorEmail = "stepverifier"
//        StepVerifier.create<Project>(projectService.createProject(creatorEmail = creatorEmail, request))
//            .expectNextMatches { it.creator==creatorEmail }
//            .expectComplete()
//            .verify()
    }

}
