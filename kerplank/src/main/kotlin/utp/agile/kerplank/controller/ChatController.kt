package utp.agile.kerplank.controller

import com.fasterxml.jackson.databind.ser.Serializers.Base
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.MODERATOR_ROLE
import utp.agile.kerplank.model.AuthenticatedUser
import utp.agile.kerplank.model.ChatPostListResponse
import utp.agile.kerplank.model.ChatPostRequest
import utp.agile.kerplank.model.ChatPostResponse
import utp.agile.kerplank.response.BaseResponse
import utp.agile.kerplank.service.ChatService


@RestController
@RequestMapping("/api/chat")
class ChatController(private val chatService: ChatService) {

//    ChatPostListResponse

    @GetMapping
    fun getAllPosts(): Mono<ChatPostListResponse> {
        return chatService.latestChatPosts()
            .collectList()
            .map { ChatPostListResponse(it) }
    }


    @PostMapping
    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
        return chatService.createChatPost(request).map { ResponseEntity.ok().body(ChatPostResponse(it)) }
    }


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
