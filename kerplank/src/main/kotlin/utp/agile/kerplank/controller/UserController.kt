package utp.agile.kerplank.controller

import com.fasterxml.jackson.databind.ser.Serializers.Base
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.MODERATOR_ROLE
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.UserRepository
import utp.agile.kerplank.response.*
import utp.agile.kerplank.service.EmailService
import utp.agile.kerplank.service.UserService

@RestController
@RequestMapping("/api/user")
class UserController(
  private  val userService: UserService,
) {

    @GetMapping("/me")
    @Operation(summary = "Pobierz informacje o zalogowanym użytkowniku.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o użytkowniku powiązanym z zalogowanym użytkownikiem.")
    fun getMyUserInformation(
        authentication: AuthenticatedUser,
    ) =
        ResponseEntity<BaseResponse>(
            WhoAmIResponse(
                authentication.username,
                authentication.email,
                authentication.details,
                authentication.roles.map { it.authority }
            ), null, HttpStatus.OK
        )


    @GetMapping("/all")
    @Operation(summary = "Pobierz informacje o wszystkich użytkownikach.", description = "Zwraca listę wszystkich użytkowników w postaci kolekcji.")
    fun getAllUsers(
        authentication: Authentication,
    ) = userService.getAllUsers().collectList()
            .map { UsersListResponse(it) }
            .defaultIfEmpty(UsersListResponse(emptyList()))


    @PutMapping()
    @Operation(summary = "Zmienia dane o użytkowniu", description = "Zwraca response.result = 'ok' gdy pomyślnie zostaną zmienione dane")
    fun update(
            authenticatedUser: AuthenticatedUser,
            @RequestBody updateRequest: UserUpdateRequest,
    ): Mono<ResponseEntity<BaseResponse>> {
        if (!authenticatedUser.roles.contains(MODERATOR_ROLE))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build<BaseResponse?>().toMono()

       return userService.updateUser(updateRequest)
                .map { ResponseEntity.ok(SuccessResponse() as BaseResponse)}
                .switchIfEmpty { ResponseEntity.notFound().build<BaseResponse>().toMono() }
                .onErrorReturn(ResponseEntity.status(400).body(FailResponse("Nie udało się usunąć użytkownika", 1002)))
    }


    @DeleteMapping("/{nickname}")
    @Operation(summary = "Usuń użytkownika na podstawie jego nazwy.", description = "Zwraca obiekt typu BaseResponse, który reprezentuje informacje o usunięciu użytkownika o określonej nazwie.")
    fun delete(
        authentication: Authentication,
        @PathVariable nickname: String
    ): Mono<BaseResponse> =
        userService.deleteUser(nickname)
            .map { SuccessResponse() as BaseResponse }
            .onErrorReturn(FailResponse("Nie udało się usunąć użytkownika", 1002) as BaseResponse)


}
