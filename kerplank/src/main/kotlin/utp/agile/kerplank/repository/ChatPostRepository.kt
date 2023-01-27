package utp.agile.kerplank.repository

import org.reactivestreams.Publisher
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import utp.agile.kerplank.model.ChatPost


@Repository
interface ChatPostRepository : ReactiveMongoRepository<ChatPost, String>{
}
