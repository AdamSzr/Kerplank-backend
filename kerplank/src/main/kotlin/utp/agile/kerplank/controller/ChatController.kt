package utp.agile.kerplank.controller

import io.swagger.v3.oas.annotations.Operation
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
    @Operation(summary = "Pobierz wszystkie wiadomości czatu.", description = "wraca obiekt typu ChatPostListResponse, który reprezentuje listę wszystkich postów w czacie.")
    fun getAllPosts(): Mono<ChatPostListResponse> {
        return chatService.latestChatPosts()
            .collectList()
            .map { ChatPostListResponse(it) }
    }

    @PostMapping
    @Operation(summary = "Wyślij nową wiadomość.", description = "Zwraca ResponseEntity z obiektem typu ChatPostResponse, który reprezentuje opublikowany post w czacie lub błąd.")
    fun publicPost(@RequestBody request: ChatPostRequest): Mono<ResponseEntity<ChatPostResponse>> {
        return chatService.createChatPost(request).map { ResponseEntity.ok().body(ChatPostResponse(it)) }
    }


    @DeleteMapping("/{postId}")
    @Operation(summary = "Usuń wiadomość czatu na podstawie identyfikatora.", description = "Zwraca ResponseEntity z obiektem typu BaseResponse, który reprezentuje informacje o usunięciu posta o określonym identyfikatorze lub błąd.")
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
