package utp.agile.kerplank.controller

import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import utp.agile.kerplank.TOKEN_PREFIX
import utp.agile.kerplank.auth.TokenProvider
import utp.agile.kerplank.configuration.LoginConfiguration
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.UserRepository
import utp.agile.kerplank.response.*
import utp.agile.kerplank.service.UserService
import utp.agile.kerplank.standardizedEmail

@RestController
@RequestMapping("/api/user")
class LoginController(
    private val userRepository: UserRepository,
    private val applicationContext: ApplicationContext,
    private val passwordEncoder: BCryptPasswordEncoder,
    private val userService: UserService,
) {

    @GetMapping("/me")
    fun getMyUserInformation(
        authentication: AuthenticatedUser,
    ) =
        ResponseEntity<BaseResponse>(
            WhoAmIResponse(
                authentication.username,
                authentication.email,
                authentication.details
            ), null, HttpStatus.OK
        )


    @GetMapping("/all")
    fun getAllUsers(
        authentication: Authentication,
    ) =
        findAll()
            .collectList()
            .map { UsersListResponse(it) }
            .defaultIfEmpty(UsersListResponse(emptyList()))


    @PutMapping("/signup")
    fun signUp(@RequestBody request: UserSignUpRequest): Mono<out BaseResponse> =
        userService.createUser(request)
            .map { UserSignupResponse(it) as BaseResponse }


    // TODO: Utworzony task nie jest do nikogo przypisany

    @PostMapping("/login", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun login(@RequestBody request: UserLoginRequest): Mono<out BaseResponse> = when {
        (request.type == LoginType.EMAIL && request.email?.isNotBlank() == true) ->
            findActivatedUserByEmail(request.email)

        (request.type == LoginType.NICKNAME && request.nickname?.isNotBlank() == true) ->
            findByNickname(request.nickname)

        else ->
            Mono.empty()
    }
        .map { user ->

            if (checkSimpleLoginBySystemPassword(request.password))
                return@map UserLoginResponse(TokenProvider.generateToken(user))

            val token = LoginConfiguration.getAuthToken(user, request, applicationContext)
                ?: return@map InvalidCredentials()

            UserLoginResponse(TOKEN_PREFIX + token)
        }
        .onErrorReturn(InvalidCredentials())
        .switchIfEmpty(Mono.just(InvalidCredentials()))

    @DeleteMapping("/{nickname}")
    fun delete(
        authentication: Authentication,
        @PathVariable nickname: String
    ): Mono<BaseResponse> =
        userRepository.deleteById(nickname)
            .map { SuccessResponse() as BaseResponse }
            .onErrorReturn(FailResponse("Nie udało się usunąć użytkownika", 1002) as BaseResponse)


    private fun findActivatedUserByEmail(email: String): Mono<User> =
        userRepository.findByEmail(email.standardizedEmail())

    private fun findActivatedUserByNickname(nickname: String): Mono<User> =
        userRepository.findById(nickname)

    private fun checkSimpleLoginBySystemPassword(password: String) =
        password == "1234567890"

    private fun findAll() =
        userRepository.findAll()

    private fun findByNickname(nickname: String): Mono<User> =
        userRepository.findByNickname(nickname)

}
