package utp.agile.kerplank

import com.mongodb.assertions.Assertions.assertNotNull
import com.mongodb.assertions.Assertions.assertTrue
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import utp.agile.kerplank.model.User
import utp.agile.kerplank.model.UserSignUpRequest
import utp.agile.kerplank.service.UserService
import utp.agile.kerplank.repository.UserRepository

@SpringBootTest
class KerplankUserServiceTests {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var passwordEncoder: BCryptPasswordEncoder

    @Autowired
    lateinit var userRepository: UserRepository

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
            .expectNextMatches { user -> passwordEncoder.matches(request.password, user.password) }
            .expectComplete()
            .verify()
    }

    @Test
    fun shouldDeleteUser() {
        val nickname = "john_doe"
        val userRepository = mock(UserRepository::class.java)
        val passwordEncoder = BCryptPasswordEncoder()

        `when`(userRepository.deleteById(nickname)).thenReturn(Mono.empty())

        val userService = UserService(userRepository, passwordEncoder)
        val result = userService.deleteUser(nickname).block()

        verify(userRepository).deleteById(nickname)
        assertThat(result).isNull()
    }

    @Test
    fun Should_Get_User_By_Email() {
        val userEmail = "test_get_user@example.com"
        val userNickname = "test_get_user"
        val userDetails = mutableMapOf<String, String>()

        val user = User(
            email = userEmail,
            password = passwordEncoder.encode("password123"),
            details = userDetails,
            nickname = userNickname
        )
        userRepository.save(user).block()

        val userMono = userService.getUserByEmail(userEmail)

        StepVerifier.create(userMono)
            .expectNextMatches { retrievedUser ->
                retrievedUser.email == userEmail &&
                        retrievedUser.nickname == userNickname &&
                        retrievedUser.details == userDetails
            }
            .expectComplete()
            .verify()

        userService.deleteUser(userNickname).block()
    }

    @Test
    fun Should_Change_User_Password() {
        val userEmail = "test_pass_user@example.com"
        val newPassword = "newPassword123"
        val userNickname = "test_pass_user"
        val userDetails = mutableMapOf<String, String>()

        val existingUser = User(
            email = userEmail,
            password = passwordEncoder.encode("oldPassword"),
            details = userDetails,
            nickname = userNickname
        )
        userRepository.save(existingUser).block()

        val updatedUserMono = userService.changeUserPassword(userEmail, newPassword)

        StepVerifier.create(updatedUserMono)
            .expectNextMatches { user ->
                passwordEncoder.matches(newPassword, user.password)
            }
            .expectComplete()
            .verify()

        val updatedUser = userRepository.findByEmail(userEmail).block()
        assertNotNull(updatedUser)
        assertTrue(passwordEncoder.matches(newPassword, updatedUser?.password))

        userService.deleteUser(userNickname).block()
    }

    @Test
    fun Should_Get_All_Users() {
        val user1 = User(
            email = "user1@example.com",
            password = passwordEncoder.encode("password123"),
            details = mutableMapOf<String, String>(),
            nickname = "testUser1"
        )
        val user2 = User(
            email = "user2@example.com",
            password = passwordEncoder.encode("password456"),
            details = mutableMapOf<String, String>(),
            nickname = "testUser2"
        )
        val user3 = User(
            email = "user3@example.com",
            password = passwordEncoder.encode("password789"),
            details = mutableMapOf<String, String>(),
            nickname = "testUser3"
        )
        val actualUserNumber = userService.getAllUsers().count().block()
        val users = listOf(user1, user2, user3)

        userRepository.saveAll(users).collectList().block()

        val allUsersFlux = userService.getAllUsers()

        StepVerifier.create(allUsersFlux)
            .expectNextCount(actualUserNumber?.plus(3) ?: 0)
            .expectComplete()
            .verify()

        userService.deleteUser("testUser1").block()
        userService.deleteUser("testUser2").block()
        userService.deleteUser("testUser3").block()
    }
}
