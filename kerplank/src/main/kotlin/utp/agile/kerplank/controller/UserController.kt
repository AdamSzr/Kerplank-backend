package utp.agile.kerplank.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
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
    fun getAllUsers(
        authentication: Authentication,
    ) = userService.getAllUsers().collectList()
            .map { UsersListResponse(it) }
            .defaultIfEmpty(UsersListResponse(emptyList()))


    @DeleteMapping("/{nickname}")
    fun delete(
        authentication: Authentication,
        @PathVariable nickname: String
    ): Mono<BaseResponse> =
        userService.deleteUser(nickname)
            .map { SuccessResponse() as BaseResponse }
            .onErrorReturn(FailResponse("Nie udało się usunąć użytkownika", 1002) as BaseResponse)


}
