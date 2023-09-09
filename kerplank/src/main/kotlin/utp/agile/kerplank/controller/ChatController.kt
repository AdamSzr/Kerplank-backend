package utp.agile.kerplank.controller

import com.fasterxml.jackson.databind.ser.Serializers.Base
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.scheduler.Scheduler
import reactor.core.scheduler.Schedulers
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.MODERATOR_ROLE
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.ChatPostRepository
import utp.agile.kerplank.repository.UserRepository
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.ChatService
import java.lang.reflect.Parameter
import java.time.Duration


@RestController
@RequestMapping("/api/chat")
class ChatController(private val chatService: ChatService, private val repository: ChatPostRepository, private val userRepository: UserRepository) {

    //Working without tailable.
//    @GetMapping(value = ["/{chatId}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
//    fun getMessages( @PathVariable chatId:Number ): Flux<ChatPost> {
//         return repository.findAllByChatId(1).delayElements(Duration.ofSeconds(1))
//    }

    //    @GetMapping(value = ["/{chatId}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
//    fun getMessages( @PathVariable chatId:Number ): Flux<ChatPost> {
//        return repository.findAllByChatId(1)
//    }
    @Operation(
            summary = "Pobierz wszystkie wiadomości",
            description = "## Zwraca listę wszystkich wiadomości",
            responses = [
                ApiResponse(
                        responseCode = "200",
                        description = "Lista wszystkich wiadomości",
                        content = [Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                array = ArraySchema(schema = Schema(implementation = ChatPost::class))
                        )]
                ),
            ]
    )
    @GetMapping( value = ["/messages"])
    fun getJsonMessages(): Flux<ChatPost> {
        return  repository.findAll()
    }

   @Operation(
           summary = "Połącz i pobierz wiadomości chat",
           description = "## Zwraca listę wiadomości",
           responses = [
               ApiResponse(
                       responseCode = "200",
                       description = "Lista wiadomości w których uczestniczy użytkownik",
                       content = [Content(
                               mediaType = MediaType.TEXT_EVENT_STREAM_VALUE,
                               array = ArraySchema(schema = Schema(implementation = ChatPost::class))
                       )]
               ),
           ]
   )
    @GetMapping( produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun getChatMessages(
            @RequestParam( required = true ) userName:String,
            @RequestParam( required = false ) chatName:String?,
            @RequestParam( required =  false ) addresseeName: String?
    ): Flux<ChatPost> {

        if( chatName!= null && addresseeName!= null)
            return Flux.empty()

        if (chatName != null) {
            return repository.findAllByChatName(chatName)
        }

        if(addresseeName != null)
            return repository.findAllByAddresseeName(addresseeName)

        return  repository.findAllByAuthorNameOrAddresseeName(userName, userName)
    }


    @Operation(
            summary = "Napisz wiadomość",
            description = "## Wysyła wiadomość na chat",
            requestBody = io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = [
                        Content(schema = Schema(implementation = ChatPostRequest::class))
                    ]
            ),
            responses = [
                ApiResponse(
                        responseCode = "200",
                        description = "Opublikowana wiadomość",
                        content = [Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema = Schema(implementation = ChatPost::class)
                        )]
                ),
            ]
    )
    @PostMapping
    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
        if(request.addresseeName == null && request.chatName==null)
            return Mono.just(ResponseEntity.badRequest().build())

        return chatService.createChatPost(request)
                .map { ResponseEntity.ok().body(ChatPostResponse(it)) }
    }

    @Operation(
            summary = "Usuń wiadomość z chat",
            description = "## Usuwa wiadomość z chat o określonym id - wymaga roli MODERATOR",
            responses = [
                ApiResponse(
                        responseCode = "200",
                        description = "Wiadomość usunięta",
                        content = [Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema = Schema(implementation = Boolean::class)
                        )]
                ),
                ApiResponse(
                        responseCode = "204",
                        description = "Wiadomość o takim id nie istnieje",
                        content = [Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema = Schema(implementation = Boolean::class)
                        )]
                ),
                ApiResponse(
                        responseCode = "401",
                        description = "Nie posiadasz uprawnien MODERATORA",
                ),
            ]
    )
    @DeleteMapping("/{postId}")
    fun deletePost(
            @PathVariable @io.swagger.v3.oas.annotations.Parameter(name = "postId", description = "Id post'u do usunięcia", example = "9ecbce5e-4ee8-11ee-be56") postId: String,
            authenticatedUser: AuthenticatedUser
    ): Mono<ResponseEntity<BaseResponse>> {
        if (!authenticatedUser.roles.contains(MODERATOR_ROLE))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build<BaseResponse?>().toMono()

        return chatService.deleteChatPost(postId)
                .flatMap {
                    when (it) {
                        true -> ResponseEntity.ok().body(BaseResponse("ok"))
                        false -> ResponseEntity.noContent().build<BaseResponse?>()
                    }.toMono()
                }
    }


}
