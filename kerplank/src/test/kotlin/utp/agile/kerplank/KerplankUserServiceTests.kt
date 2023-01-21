package utp.agile.kerplank

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import reactor.test.StepVerifier
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserSignUpRequest
import utp.agile.kerplank.service.UserService

@SpringBootTest
class KerplankUserServiceTests {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var passwordencoder: BCryptPasswordEncoder

    @Test
    fun Should_Create_User_With_Given_Name() {
        val request = UserSignUpRequest(nickname = "stepverifier", email = "stepverifier", password = "stepverifier");

        StepVerifier.create<User>(userService.createUser(request))
            .expectNextMatches { user -> user.email == (request.email) }
            .expectComplete()
            .verify()
    }

    @Test
    fun Should_Create_User_With_Encrypted_Password() {
        val request = UserSignUpRequest(nickname = "stepverifier", email = "stepverifier", password = "stepverifier");

        StepVerifier.create<User>(userService.createUser(request))
            .expectNextMatches { user -> passwordencoder.matches(request.password, user.password) }
            .expectComplete()
            .verify()
    }


}
