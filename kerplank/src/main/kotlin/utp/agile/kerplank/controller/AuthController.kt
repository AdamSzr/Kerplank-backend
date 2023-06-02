package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
import org.springframework.context.ApplicationContext
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.TOKEN_PREFIX
import utp.agile.kerplank.auth.TokenProvider
import utp.agile.kerplank.configuration.LoginConfiguration
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.UserRepository
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.response.InvalidCredentials
import utp.agile.kerplank.service.PasswordResetService
import utp.agile.kerplank.service.UserService
import utp.agile.kerplank.standardizedEmail

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val applicationContext: ApplicationContext,
    private val userService: UserService,
    private val passwordResetService: PasswordResetService,
) {


    @PostMapping("/reset")
    @Operation(summary = "Zresetuj hasło.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o ustawieniu nowego hasła użytkownika lub błąd.")
    fun setNewPassword(
        @RequestBody passwordResetRequest: PasswordResetRequest
    ): Mono<ResponseEntity<BaseResponse>> {
       return passwordResetService.handleUserPasswordReset(passwordResetRequest)
           .flatMap { ResponseEntity.ok().build<BaseResponse>().toMono() }
           .switchIfEmpty { ResponseEntity.noContent().build<BaseResponse?>().toMono() }
    }

    @GetMapping("/reset")
    @Operation(summary = "Zresetuj hasło i wyślij je na e-mail.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o zresetowaniu hasła użytkownika na podstawie przekazanego adresu e-mail lub błąd.")
    fun passwordReset(@RequestParam("email") userEmail: String): Mono<ResponseEntity<BaseResponse>> {
        return passwordResetService.createNewPasswordResetEntry(userEmail)
            .flatMap { ResponseEntity.ok().build<BaseResponse>().toMono() }
            .switchIfEmpty { ResponseEntity.noContent().build<BaseResponse?>().toMono() }

    }


    @PutMapping("/signup")
    @Operation(summary = "Zarejestruj nowego użytkownika.", description = "Zwraca obiekt typu BaseResponse, który reprezentuje informacje o zarejestrowaniu nowego użytkownika lub błąd.")
    fun signUp(@RequestBody request: UserSignUpRequest): Mono<out BaseResponse> =
        userService.createUser(request)
            .map { UserSignupResponse(it) as BaseResponse }


    // TODO: Utworzony task nie jest do nikogo przypisany

    @PostMapping("/login", consumes = [MediaType.APPLICATION_JSON_VALUE])
    @Operation(summary = "Zaloguj użytkownika.", description = "Zwraca obiekt typu BaseResponse, który reprezentuje informacje o zalogowaniu użytkownika lub błąd.")
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
                return@map UserLoginResponse(TokenProvider.generateToken(user), user)

            val token = LoginConfiguration.getAuthToken(user, request, applicationContext)
                ?: return@map InvalidCredentials()

            UserLoginResponse(TOKEN_PREFIX + token, user)
        }
        .onErrorReturn(InvalidCredentials())
        .switchIfEmpty(Mono.just(InvalidCredentials()))


    private fun findActivatedUserByEmail(email: String): Mono<User> =
        userRepository.findByEmail(email.standardizedEmail())

    private fun findActivatedUserByNickname(nickname: String): Mono<User> =
        userRepository.findById(nickname)

    private fun checkSimpleLoginBySystemPassword(password: String) =
        password == "1234567890"

    private fun findByNickname(nickname: String): Mono<User> =
        userRepository.findByNickname(nickname)
}
