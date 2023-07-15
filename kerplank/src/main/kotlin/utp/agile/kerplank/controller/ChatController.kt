package utp.agile.kerplank.controller

import com.fasterxml.jackson.databind.ser.Serializers.Base
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
    @GetMapping( value = ["/messages"])
    fun getJsonMessages(
    //        authenticatedUser: AuthenticatedUser
    ): Flux<ChatPost> {
        return  repository.findAll()
    }


    @GetMapping( produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun getChatMessages(
            @RequestParam( required = true) userName:String,
            @RequestParam(required = false) chatName:String?,
            @RequestParam( required =  false) addresseeName: String?
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

    @PostMapping
    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
        if(request.addresseeName == null && request.chatName==null)
            return Mono.just(ResponseEntity.badRequest().build())

        return chatService.createChatPost(request)
                .map { ResponseEntity.ok().body(ChatPostResponse(it)) }
    }

//    @GetMapping
//    fun getAllPosts(): Mono<ChatPostListResponse> {
//        return chatService.latestChatPosts()
//            .collectList()
//            .map { ChatPostListResponse(it) }
//    }
//
//
//    @PostMapping
//    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
//        return chatService.createChatPost(request).map { ResponseEntity.ok().body(ChatPostResponse(it)) }
//    }
//
//
    @DeleteMapping("/{postId}")
    fun deletePost(
        @PathVariable postId: String,
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
