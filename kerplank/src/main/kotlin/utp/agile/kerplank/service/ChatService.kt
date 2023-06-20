package utp.agile.kerplank.service

import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.GetMapping
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import utp.agile.kerplank.model.AuthenticatedUser
import utp.agile.kerplank.model.ChatPost
import utp.agile.kerplank.model.ChatPostRequest
import utp.agile.kerplank.repository.ChatPostRepository

@Service
class ChatService(private val repository: ChatPostRepository) {


    fun latestChatPosts(): Flux<ChatPost> {
       return repository.findAll(Sort.by(Sort.Direction.DESC,"created"))
    }

    fun createChatPost(request: ChatPostRequest): Mono<ChatPost> {
        return repository.save(request.createChatPost())
    }

    fun deleteChatPost(postId: String): Mono<Boolean> {
        return repository.findById(postId)
            .doOnNext { repository.deleteById(postId).subscribe() }
            .flatMap { Mono.just(true) }
            .switchIfEmpty(Mono.just(false))
    }

}
