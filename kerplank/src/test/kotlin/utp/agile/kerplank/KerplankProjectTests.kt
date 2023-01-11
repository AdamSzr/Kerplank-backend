package utp.agile.kerplank

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import reactor.test.StepVerifier
import utp.agile.kerplank.model.Project
import utp.agile.kerplank.model.ProjectCreateRequest
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserSignUpRequest
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

    @Test
    fun Should_Create_Project_With_Given_Name() {
        val request = ProjectCreateRequest("test-reactor-verifier", "adam-test-backned", Instant.now())
        val creatorEmail = "stepverifier"
        StepVerifier.create<Project>(projectService.createProject(creatorEmail = creatorEmail, request))
            .expectNextMatches { it.creator==creatorEmail }
            .expectComplete()
            .verify()
    }

}
