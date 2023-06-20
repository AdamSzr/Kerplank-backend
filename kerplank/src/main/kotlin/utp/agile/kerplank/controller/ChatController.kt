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
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.MODERATOR_ROLE
import utp.agile.kerplank.model.*
import utp.agile.kerplank.repository.ChatPostRepository
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.ChatService
import java.time.Duration



@RestController
@RequestMapping("/api/chat")
class ChatController(private val chatService: ChatService, private val repository: ChatPostRepository) {

    //Working without tailable.
//    @GetMapping(value = ["/{chatId}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
//    fun getMessages( @PathVariable chatId:Number ): Flux<ChatPost> {
//         return repository.findAllByChatId(1).delayElements(Duration.ofSeconds(1))
//    }

    @GetMapping(value = ["/{chatId}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun getMessages( @PathVariable chatId:Number ): Flux<ChatPost> {
        return repository.findAllByChatId(1)
    }

    @PostMapping
    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
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
//    @DeleteMapping("/{postId}")
//    fun deletePost(
//        @PathVariable postId: String,
//        authenticatedUser: AuthenticatedUser
//    ): Mono<ResponseEntity<BaseResponse>> {
//        if (!authenticatedUser.roles.contains(MODERATOR_ROLE))
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build<BaseResponse?>().toMono()
//
//        return chatService.deleteChatPost(postId)
//            .flatMap {
//                when (it) {
//                    true -> ResponseEntity.ok().body(BaseResponse("ok"))
//                    false -> ResponseEntity.noContent().build<BaseResponse?>()
//                }.toMono()
//            }
//    }


}
