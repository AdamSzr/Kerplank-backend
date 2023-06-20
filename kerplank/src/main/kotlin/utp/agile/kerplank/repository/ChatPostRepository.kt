package utp.agile.kerplank.repository

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.data.mongodb.repository.Tailable
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import utp.agile.kerplank.model.ChatPost


@Repository
interface ChatPostRepository : ReactiveMongoRepository<ChatPost, String>{
    @Tailable
    fun findAllByChatId(chatId: Int): Flux<ChatPost>
}
