package utp.agile.kerplank.controller

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
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


    @GetMapping("posts-all")
    fun getAllPostsV2(@RequestParam(defaultValue = "0") page: Int,
                      @RequestParam(defaultValue = "10") size: Int): Mono<Any> {
        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())

        return pageable.toMono()
//        chatService.getAllChatPosts(pageable)
//            .collectList()
//            .map { ChatPostListResponse(it) }
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
