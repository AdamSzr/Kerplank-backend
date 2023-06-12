package utp.agile.kerplank

import org.junit.jupiter.api.Assertions
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
import java.time.Duration
import java.time.Instant
import java.util.function.Predicate


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
                .expectNextMatches { it.creator==creatorEmail}
                .expectComplete()
                .verify()
    }


    @Test
    fun Should_Delete_File_WithIn_Given_Proj() {
        val projectId = "644feb7a7a4ad85d5de3ea83"

        val project = projectService.findProjectById(projectId,"user").block() ?: return

        publisher.publishEvent(FileDeleteEvent(project.files.toList().get(0)))
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

}
